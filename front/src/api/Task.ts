import config from "@/config";
import Fetch from "@helpers/Fetch";

const mfetch = new Fetch();

export interface ICreate {
    title: string;
    description: string;
    isDraft: boolean;
    isComplete: boolean;
    endDate: string | null
};

export const create = async (payload: ICreate, signal: abortSignal = null) => {
    const dataFetch = await mfetch.setFetch({
        url: config.PATH_BASE_API + "task/create",
        requestInit: {
            method: "POST",
            body: JSON.stringify(payload),
            signal
        }
    });
    return dataFetch;
};

interface IUpdate extends Partial<ICreate> {
    _id: string;
}

export const update = async (payload: IUpdate, signal: abortSignal = null) => {
    const dataFetch = await mfetch.setFetch({
        url: config.PATH_BASE_API + "task/update",
        requestInit: {
            method: "PUT",
            body: JSON.stringify(payload),
            signal
        }
    });
    return dataFetch;
};

export const remove = async (payload: { _id: string }, signal: abortSignal = null) => {
    const dataFetch = await mfetch.setFetch({
        url: config.PATH_BASE_API + "task/remove",
        requestInit: {
            method: "DELETE",
            body: JSON.stringify(payload),
            signal
        }
    });
    return dataFetch;
}

export type TypeFilter = {
    id?: string,
    idUser?: string,
    title?: string,
    isDraft?: boolean,
    isComplete?: boolean,
    endDate?: string,
    createAt?: string,
};

interface IFilter {
    fields: Array<string>,
    query: string
};

export const filter = async <T = any>(payload: IFilter, signal: abortSignal = null) => {
    const prepareFields = payload.fields.join(".");

    const dataFetch = await mfetch.setFetch<T>({
        url: `${config.PATH_BASE_API}task/filter/${prepareFields}?${payload.query}`,
        requestInit: {
            method: "GET",
            signal
        }
    });

    return dataFetch;
}

export const countPending = async (signal: abortSignal = null) => {
    const dataFetch = await mfetch.setFetch<{ total: number, totalComplete: number }>({
        url: `${config.PATH_BASE_API}task/countpending`,
        requestInit: {
            method: "GET",
            signal
        }
    });

    return dataFetch;
}
