import User from "../model/user";
import type { IUser } from "../model/user";

export const login = async (payload: { email: string }) => {
    const result = await User.findOne<Pick<IUser, "_id" | "name" | "password">>({ email: payload.email }, { _id: 1, name: 1, password: 1 }).exec();
    return result;
}

export const register = async (payload: { name: string; email:string, password: string }): Promise<{ _id: string; }> => {
    const user = new User({
        email: payload.email,
        password: payload.password,
        name: payload.name
    });
    const { _id } = await user.save();
    return { _id: _id.toString() };
}

export const update = async (payload: { _id: string, data: Partial<IUser> }) => {
    // const result = await User.findByIdAndUpdate(payload._id, payload.data, { projection: { _id: 1 } });
    const result = await User.findById(payload._id, { projection: { _id: 1 } });
    if (result?.$set) result.$set(payload.data);
    result?.save();
    return result;
}

interface IFilter {
    match: object,
    project: object,
    sort: any,
    skip: number,
    limit: number
}

export const filter = async (payload: IFilter) => {
    const result = await User.aggregate([
        { $match: payload.match || {} },
        { $project: payload.project },
        { $sort: payload.sort || {} },
        { $skip: payload.skip || 0 },
        { $limit: payload.limit || 10 }
    ]);

    return result;
}

type TypeValidatePassword = {
    _id: string
};

export const validatePassword = async (payload: TypeValidatePassword) => {
    const result = await User.findOne<Pick<IUser, "_id" | "password">>({ _id: payload._id }, { _id: 1, password: 1 }).exec();
    return result;
}
