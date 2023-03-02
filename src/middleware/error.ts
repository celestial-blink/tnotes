import { Request, Response, NextFunction } from 'express';
import { Error } from 'mongoose';
import response from '../core/response';

export const logError = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err, err.name);
    next(err)
};

export const ornError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error.ValidationError) {
        res.status(409);
        response(res, {
            state: false,
            data: {},
            message: err.message
        });
    };
    next(err);
};

export const boomError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.isBoom) {
      const { output } = err;
      res.status(output.statusCode).json(output.payload);
    } else {
      next(err);
    }
  }

export const responseError = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500);
    response(res, {
        state: false,
        data: {},
        message: err.message
    });
};
