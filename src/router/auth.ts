import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { Types } from "mongoose";
import response from "../core/response";
import { register, filter, validatePassword } from "../controller/user";
import jwt, { verify } from "jsonwebtoken";
import config from "../config";
import crypto from "crypto";
import { compare } from 'bcrypt';
import boom from "@hapi/boom";
import { refreshToken } from "../middleware/auth";

import type { IUser } from "../model/user";

export type TypePayloadToken = { sub: string, name: string };

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
        const payload: TypePayloadToken = {
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

        response(req, res, {
            data: { token },
            message: "",
            state: true
        });
    } catch (error) { next(error); }
});

user.post("/register", async (req: Request, res: Response, next) => {
    try {
        const { email, password, name } = req.body;
        const result = await register({ email, password, name });
        response(req, res, {
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

        response(req, res, {
            data: { token },
            message: "",
            state: true
        });
    } catch (error) { next(error); }
});

user.get("/my_session", refreshToken,
    async (req: Request, res: Response) => {
        const { sub } = req.user as TypePayloadToken;
        const name = await filter({
            project: { name: 1, email: 1 },
            limit: 1,
            match: { _id: new Types.ObjectId(sub) },
            skip: 0,
            sort: { _id: 1 }
        });
        response(req, res, {
            data: { sub, name: name[0].name, email: name[0].email },
            message: "",
            state: true
        });
    }
);


user.get("/logout", (req: Request, res: Response) => {
    const mdate = Date.now() - 1;
    res.cookie("refresh_token", "", { maxAge: mdate, httpOnly: true, secure: true });
    res.cookie("iv", "", { maxAge: mdate, httpOnly: true, secure: true });
    res.cookie("tag", "", { maxAge: mdate, httpOnly: true, secure: true });

    response(req, res, {
        data: "",
        message: "",
        state: true
    })
});

user.post("/confirm_password", refreshToken,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sub } = req.user as TypePayloadToken;
            const result = await validatePassword({ _id: sub });
            const isMatch = await compare(req.body.password, result?.password ?? "");
            if (!isMatch) throw boom.badRequest("Contraseñas incorrectos");
            response(req, res, {
                data: "",
                message: "",
                state: true
            });
        } catch (error) { next(error); }

    }
);

export default user;
