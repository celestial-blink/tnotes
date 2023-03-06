import { Router, Request, Response } from "express";
import response from "../core/response";
import passport from "passport";
import { update, filter } from "../controller/user";
import config from "../config";
import boom from "@hapi/boom";

const user: Router = Router();

user.put("update", passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response, next) => {
        try {
            const { _id, ...data } = req.body?.payload;
            const result = await update({
                _id, data
            });
            response(res, {
                data: result,
                message: "",
                state: true
            });
        } catch (error) { next(error); }
    }
);


user.get("filter/:keys-:values/:fields/:sortby-:ordertype/:offset-:rowcount", passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response, next) => {
        try {
            const { keys = "", values = "", fields = "", sortby = "_id", ordertype = "1", offset = "0", rowcount = "10" } = req.params;
            const formatKeys = keys.split("-");
            const formatValues = values.split("-");
            if (formatKeys.length !== formatValues.length) boom.badData();
            const match = formatKeys.reduce((pv, cv, index) => ({ ...pv, [cv]: formatValues[index] }), {});
            const formatFields = fields.split("-");
            const project = formatFields.reduce((pv, cv) => ({ ...pv, [cv]: 1 }), {});
            const sort = { [sortby]: parseInt(ordertype) || 1 };
            const skip = parseInt(offset) || 0;
            const limit = parseInt(rowcount) || config.moongose_limit;

            const result = await filter({
                match, project, skip,
                sort, limit
            })
            response(res, {
                data: result,
                message: "",
                state: true
            });
        } catch (error) { next(error); }
    }
);

export default user;
