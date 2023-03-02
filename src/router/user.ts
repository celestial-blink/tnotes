import { Router, Request, Response } from "express";
import response from "../core/response";
import passport from "passport";

const user: Router = Router();

user.get("/", passport.authenticate("jwt", { session: false }), (req: Request, res: Response) => {
    response(res, {
        data: {},
        message: "test de prueba",
        state: true,
        optional: { tested: "tested" }
    })
})

export default user;
