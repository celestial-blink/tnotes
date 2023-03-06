import { Router, Request, Response } from "express";
import passport from "passport";
import response from "../core/response";
import { create, filter, remove, update } from "../controller/note";
import boom from "@hapi/boom";
import config from "../config";

const note: Router = Router();

note.post("create", passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response, next) => {
        try {
            const result = await create({
                ...(req.body?.payload ?? {}),
                idUser: (req?.user as any)?.sub
            });
            response(res, {
                data: result,
                message: "",
                state: true
            })
        } catch (error) { next(error); }
    }
);

note.put("update", passport.authenticate("jwt", { session: false }),
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

note.delete("remove", passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response, next) => {
        try {
            const result = await remove({
                _id: (req.body?.payload as any)?._id
            });
            response(res, {
                data: result,
                message: "",
                state: true
            });
        } catch (error) { next(error); }
    }
);

note.get("filter/:keys-:values/:fields/:sortby-:ordertype/:offset-:rowcount", passport.authenticate("jwt", { session: false }),
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

export default note;
