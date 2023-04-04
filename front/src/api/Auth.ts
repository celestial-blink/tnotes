import config from "@/config";
import Fetch from "@helpers/Fetch";

const mfetch = new Fetch();

export const MySession = async (signal: abortSignal = null) => {
    const dataFetch = await mfetch.setFetch({
        url: config.PATH_BASE_API + "auth/my_session",
        requestInit: {
            signal
        }
    });

    return dataFetch;
}

type login = { email: string, password: string };

export const Login = async ({ email, password }: login, signal: abortSignal = null) => {
    if (!email || !password) return false;
    const dataFetch = await mfetch.setFetch<{ token: string }>({
        url: config.PATH_BASE_API + "auth/login",
        requestInit: {
            signal,
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        }
    });

    return dataFetch;
}

export const Register = async ({ email, password }: login, signal: abortSignal = null) => {
    if (!email || !password) return false;
    const dataFetch = await mfetch.setFetch({
        url: config.PATH_BASE_API + "auth/register",
        requestInit: {
            signal,
            method: "POST",
            body: JSON.stringify({ email, password })
        }
    });

    return dataFetch;
}
