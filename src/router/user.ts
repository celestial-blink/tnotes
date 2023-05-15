import { Router, Request, Response } from "express";
import response from "../core/response";
import { update } from "../controller/user";

import { refreshToken } from "../middleware/auth";

const user: Router = Router();

user.put("/update", refreshToken,
    async (req: Request, res: Response, next) => {
        try {
            const { _id, ...data } = req.body;
            const result = await update({
                _id, data
            });
            response(req, res, {
                data: result,
                message: "",
                state: true
            });
        } catch (error) { next(error); }
    }
);

export default user;
