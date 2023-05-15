import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import response from "../core/response";
import config from "../config";
import { create, update, remove, filter, totalFilter } from "../controller/task";
import type { TypePayloadToken } from "./auth";
import { refreshToken } from "../middleware/auth";

const task: Router = Router();

task.post("/create", refreshToken,
    async (req: Request, res: Response, next) => {
        try {
            const { sub } = req.user as TypePayloadToken;
            const { _id, ...data } = req.body;
            const result = await create({
                ...(data ?? {}),
                idUser: sub
            });
            response(req, res, {
                data: result,
                message: "",
                state: true
            })
        } catch (error) { next(error); }
    }
);

task.put("/update", refreshToken,
    async (req: Request, res: Response, next) => {
        try {
            const { sub } = req.user as TypePayloadToken;
            const { _id, ...data } = req.body;
            const result = await update({
                _id, idUser: sub, data
            });
            response(req, res, {
                data: result,
                message: "",
                state: true
            });
        } catch (error) { next(error); }
    }
);

task.delete("/remove", refreshToken,
    async (req: Request, res: Response, next) => {
        try {
            const { sub } = req.user as TypePayloadToken;
            const { _id } = req.body;

            const result = await remove({
                _id, idUser: sub
            });
            response(req, res, {
                data: result,
                message: "",
                state: true
            });
        } catch (error) { next(error); }
    }
);

task.get("/filter/:fields?", refreshToken,
    async (req: Request, res: Response, next) => {
        try {
            const { sub = "" } = req.user as TypePayloadToken;
            const { fields = "" } = req.params;

            const { limit, match, skip, sort, typeresult, offset } = prepareFilterParams(req.query, sub);

            const formatFields = fields.trim() ? fields.split(".") : [];
            const project = formatFields.length > 0 ? formatFields.reduce((pv, cv) => ({ ...pv, [cv]: 1 }), {}) : { _id: 1 };

            const result = typeresult === "onlycount"
                ? []
                : await filter({
                    match: match, project, skip,
                    sort, limit
                });

            const totalResult = typeresult === "onlyresult"
                ? [{ total: 0, totalPages: 0, currentPage: 0 }]
                : await totalFilter({
                    match: match, project, skip,
                    sort, limit
                });

            const prepareData = {
                result, total: { ...totalResult[0], currentPage: offset + 1 }
            }

            response(req, res, {
                data: prepareData,
                message: "",
                state: true
            });
        } catch (error) { next(error); }
    }
);

const prepareFilterParams = (payload = {}, sub: string) => {
    const {
        _id = null, title = null, isDraft = null, createAt = null, isComplete = null, endDate = null,
        sortby = "_id", sorttype = "-1", offset = "0", rowcount = "10",
        typeresult = "all"
    } = payload as any;

    const match = Object.entries({
        _id: { value: _id, as: new Types.ObjectId(_id) },
        title: { value: title, as: { $regex: `${title}`, $options: "i" } },
        isDraft: { value: isDraft, as: isDraft === "true" },
        createAt: { value: createAt, as: new Date(createAt ?? Date.now()) },
        idUser: { value: true, as: new Types.ObjectId(sub) },
        isComplete: { value: isComplete, as: isComplete === "true" },
        endDate: { value: endDate, as: endDate === "null" ? null : new Date(endDate?.toString() ?? Date.now()) }
    }).reduce((pv, cv) => {
        return cv[1].value ? { ...pv, [cv[0]]: cv[1].as } : pv;
    }, {});

    const sort = { [sortby]: parseInt(sorttype) || 1 };
    const skip = (parseInt(offset) || 0) * (parseInt(rowcount) || 0);
    const limit = parseInt(rowcount) || config.moongose_limit;
    const prepareOffset = parseInt(offset ?? "0");

    return {
        match, sort, skip, limit, typeresult, offset: prepareOffset
    }
};

task.get("/countpending", refreshToken,
    async (req: Request, res: Response, next) => {
        try {
            const { sub } = req.user as TypePayloadToken;

            const resultTotal = await totalFilter({
                match: { idUser: new Types.ObjectId(sub), isDraft: false }, project: { _id: 1 }, skip: 0,
                sort: { _id: 1 }, limit: 10
            });

            const resultComplete = await totalFilter({
                match: { idUser: new Types.ObjectId(sub), isComplete: true, isDraft: false }, project: { _id: 1 }, skip: 0,
                sort: { _id: 1 }, limit: 10
            });

            response(req, res, {
                data: {
                    total: resultTotal?.[0]?.total ?? 0,
                    totalComplete: resultComplete?.[0]?.total ?? 0
                },
                message: "",
                state: true
            });
        } catch (error) { next(error); }
    }
);

export default task;
