import { Router, Request, Response } from "express";
import passport from "passport";
import response from "../core/response";
import { register } from "../controller/user";
import jwt, { JwtPayload, verify } from "jsonwebtoken";
import config from "../config";
import crypto from "crypto";
import boom from "@hapi/boom";


import type { IUser } from "../model/user";

const generateIv = (): string => {
    let iv: Buffer | string = crypto.randomBytes(16);
    iv = iv.toString("hex").slice(0, 16);
    return iv;
}

const generateKey = (): Buffer => {
    let key = Buffer.from(config.jwt_secret_refresh, "utf-8");
    key = crypto.createHash("sha256").update(key).digest();
    return key;
}

const cipherGcm = (payload: object, key: Buffer, iv: string): { tag: string, encrypted: string } => {
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    let encrypted = cipher.update(JSON.stringify(payload), 'utf-8', 'hex');
    encrypted += cipher.final("hex");
    const tag = cipher.getAuthTag().toString("hex");
    return { encrypted, tag };
}

const decipherGcm = (payload: string, iv: string, tag: string) => {
    const key = generateKey();
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(Buffer.from(tag, "hex"));

    let decrypted = decipher.update(payload, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const user: Router = Router();

user.post("/login", passport.authenticate('local', { session: false }), async (req: Request, res: Response, next) => {
    try {
        const { _id, name } = req.user as Pick<IUser, "_id" | "name">;
        const payload: JwtPayload = {
            sub: _id.toString(),
            name: name,
        }

        const iv = generateIv();
        const key = generateKey();

        const { encrypted, tag } = cipherGcm(payload, key, iv);

        const refreshToken = jwt.sign({ refresh: encrypted }, config.jwt_secret_refresh, { expiresIn: '2d' });
        const token = jwt.sign(payload, config.jwt_secret, { expiresIn: '3m' });

        res.cookie("refresh_token", refreshToken, { maxAge: Date.now() + (2 * 24 * 60 * 60 * 1000), httpOnly: true, secure: true });
        res.cookie("iv", iv, { maxAge: Date.now() + (2 * 24 * 60 * 60 * 1000), httpOnly: true, secure: true });
        res.cookie("tag", tag, { maxAge: Date.now() + (2 * 24 * 60 * 60 * 1000), httpOnly: true, secure: true });

        response(res, {
            data: { token },
            message: "",
            state: true
        });
    } catch (error) { next(error); }
});

user.post("/register", async (req: Request, res: Response, next) => {
    try {
        const { email, password } = req.body;
        const result = await register({ email, password });
        response(res, {
            data: result,
            message: "",
            state: true
        });
    } catch (error) { next(error); }
});

user.get("/refresh_token", async (req: Request, res: Response, next) => {
    try {
        const { iv = "", refresh_token = "", tag = "" } = req.cookies;
        if (!iv || !refresh_token || !tag) boom.notFound();

        const payloadRefreshToken = verify(refresh_token, config.jwt_secret_refresh) as { refresh: string, iat: number, exp: number };

        const decipherString = decipherGcm(payloadRefreshToken.refresh, iv, tag);

        const preparePayload = JSON.parse(decipherString);

        const newIv = generateIv();
        const key = generateKey();

        const { encrypted: newEncrypted, tag: newTag } = cipherGcm(preparePayload, key, newIv);

        const refreshToken = jwt.sign({ refresh: newEncrypted }, config.jwt_secret_refresh, { expiresIn: '2d' });
        const token = jwt.sign(preparePayload, config.jwt_secret, { expiresIn: '3m' });

        res.cookie("refresh_token", refreshToken, { maxAge: Date.now() + (2 * 24 * 60 * 60 * 1000), httpOnly: true, secure: true });
        res.cookie("iv", newIv, { maxAge: Date.now() + (2 * 24 * 60 * 60 * 1000), httpOnly: true, secure: true });
        res.cookie("tag", newTag, { maxAge: Date.now() + (2 * 24 * 60 * 60 * 1000), httpOnly: true, secure: true });

        response(res, {
            data: { token },
            message: "",
            state: true
        });
    } catch (error) { next(error); }
});


user.get("/my-session", passport.authenticate("jwt", { session: false }),
    (req: Request, res: Response) => {
        const { sub, name } = req.user as { sub: string, name: string };
        response(res, {
            data: { sub, name },
            message: "",
            state: true
        });
    }
);

export default user;
