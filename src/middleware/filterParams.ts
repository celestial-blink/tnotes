import { Request, Response, NextFunction } from 'express';
import { Types } from "mongoose";

import type { TypePayloadToken } from '../router/auth';


export const logError = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err, err.name);
    next(err)
};

// export const filterParams = (defaultParams: {}) => {
//     return (err:any, req: Request, res: Response, next: NextFunction) => {
//         const { sub } = req.user as TypePayloadToken;

//         const prepareQuery = Object.entries(defaultParams).reduce((pv, [key, value]) => {
//             const prepareValue = req.query[key] ?? value;
//             return { ...pv, [key]: prepareValue }
//          }, {});

//         const match = Object.entries({
//             _id: { value: payloadStructure._id, as: new Types.ObjectId(payloadStructure._id.toString()) },
//             title: { value: title, as: { $regex: `${title}`, $options: "i" } },
//             isDraft: { value: isDraft, as: isDraft === "true" },
//             createAt: { value: createAt, as: new Date(createAt?.toString() ?? Date.now()) },
//             idUser: { value: true, as: new Types.ObjectId(sub) }
//         }).reduce((pv, cv) => {
//             return cv[1].value ? { ...pv, [cv[0]]: cv[1].as } : pv;
//         }, {});

//         const sort = { [sortby.toString()]: parseInt(sorttype.toString()) || 1 };
//         const skip = (parseInt(offset.toString()) || 0) * (parseInt(rowcount.toString()) || 0);
//         const limit = parseInt(rowcount.toString()) || config.moongose_limit;

//         return {
//             match, sort, skip, limit, typeresult
//         }
//     }
// }
