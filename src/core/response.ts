import { Response } from "express";
import type { Request } from "express";

export interface IPayload {
    state: boolean,
    data: any,
    message: string,
    optional?: object
}

const response = (req: Request, res: Response, payload: IPayload) => {
    if (req?.token) payload.data.token = req.token;
    res.json(payload);
}

export default response;
