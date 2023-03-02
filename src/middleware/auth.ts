import { Request, Response, NextFunction } from 'express';
import response from '../core/response';


export const validateToken = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err, err.name);
    next(err)
};
