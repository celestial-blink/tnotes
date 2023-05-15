import config from "@/config";
import Fetch from "@helpers/Fetch";

const mfetch = new Fetch();

export type TypeMySession = { sub: string, name: string, email: string };

export const MySession = async (signal: abortSignal = null) => {
    const dataFetch = await mfetch.setFetch<TypeMySession>({
        url: config.PATH_BASE_API + "auth/my_session",
        requestInit: {
            signal,
            method: "GET"
        }
    });

    return dataFetch;
}

type TypeLogin = { password: string, email: string };

export const Login = async ({ email, password }: TypeLogin, signal: abortSignal = null) => {
    const dataFetch = await mfetch.setFetch<{ token: string }>({
        url: config.PATH_BASE_API + "auth/login",
        requestInit: {
            method: "POST",
            body: JSON.stringify({ email, password }),
            signal
        }
    });

    return dataFetch;
}

type TypeRegister = TypeLogin & {
    name: string
};

export const Register = async ({ email, password, name }: TypeRegister, signal: abortSignal = null) => {
    const dataFetch = await mfetch.setFetch({
        url: config.PATH_BASE_API + "auth/register",
        requestInit: {
            signal,
            method: "POST",
            body: JSON.stringify({ email, password, name })
        }
    });

    return dataFetch;
}

export const Logout = async (signal: abortSignal = null) => {
    const dataFetch = await mfetch.setFetch<string>({
        url: config.PATH_BASE_API + "auth/logout",
        requestInit: {
            method: "GET",
            signal
        }
    });
    return dataFetch;
}

export const ValidatePassword = async ({ password }: { password: string }, signal: abortSignal = null) => {
    const dataFetch = await mfetch.setFetch<string>({
        url: config.PATH_BASE_API + "auth/confirm_password",
        requestInit: {
            method: "POST",
            body: JSON.stringify({ password }),
            signal
        }
    });
    return dataFetch;
};
