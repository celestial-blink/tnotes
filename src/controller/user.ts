import User from "../model/user";
import type { IUser } from "../model/user";

export const login = async (payload: { email:string }) => {
    const result = User.findOne<Pick<IUser, "_id" | "name" | "password">>({ email: payload.email }, { _id: 1, name: 1, password: 1 });
    return result;
}

export const register = async (payload: { email:string, password: string }): Promise<{ _id: string; }> => {
    if (!payload.email || !payload.password) throw new Error("No se encontró los datos");
    const user = new User({
        email: payload.email,
        password: payload.password
    });
    const { _id } = await user.save();
    return { _id: _id.toString() };
}

export const update = async (payload: { _id: string, data: Partial<IUser> }) => {
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
