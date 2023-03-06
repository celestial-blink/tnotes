import config from "../config";
import User from "../model/user";

export interface IFind {
    email: string,
}

export const login = async <Type>(payload: IFind) => {
    const result = User.findOne<Type>({ email: payload.email }, { _id: 1, name: 1, password: 1 });
    return result;
}

export interface IRegister {
    email: string,
    password: string
}

export const register = async (payload: IRegister) => {
    if (!payload.email || !payload.password) throw new Error("No se encontró los datos");
    const user = new User({
        email: payload.email,
        password: payload.password
    });
    const { _id } = await user.save();
    return { _id };
}

interface IUpdate {
    _id: string,
    data: object
}

export const update = async (payload: IUpdate) => {
    const result = User.findByIdAndUpdate(payload._id, payload.data, { projection: { _id: 1 } });
    return result;
}

interface IFilter {
    match?: object,
    project?: object,
    sort?: any,
    skip?: number,
    limit?: number
}

export const filter = (payload: IFilter) => {
    const result = User.aggregate([
        { $match: payload?.match ?? {} },
        { $project: payload?.project ?? {} },
        { $sort: payload?.sort ?? {} },
        { $skip: payload?.skip ?? 0 },
        { $limit: payload?.limit ?? 10 },
        { $count: "total" },
        {
            $addFields: {
                perPage: { $ceil: { $divide: ["$total", payload?.limit ?? 10] } },
                currentPage: (payload?.skip ?? 0) + 1
            }
        }
    ]);
    return result;
}
