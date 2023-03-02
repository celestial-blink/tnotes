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
