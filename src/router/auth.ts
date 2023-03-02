import { Router, Request, Response } from "express";
import passport from "passport";
import response from "../core/response";
import { register } from "../controller/user";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const user: Router = Router();

user.post("/login", passport.authenticate('local', { session: false }), async (req: Request, res: Response, next) => {
    try {
        const payload: JwtPayload = {
            sub: (req.user as any)?._id ?? 0,
            name: (req.user as any)?.name ?? "",
        }

        const token = jwt.sign(payload, config?.jwt_secret ?? "", { expiresIn: '10m' });
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

export default user;
