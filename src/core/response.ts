import { Response } from "express";

export interface IPayload {
    state: boolean,
    data: any,
    message: string,
    optional?: object
}

const response = (res: Response, payload: IPayload) => {
    console.log(payload);
    res.json(payload);
}

export default response;
