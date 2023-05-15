import config from "@/config";
import Fetch from "@helpers/Fetch";

const mfetch = new Fetch();

export interface ICreate {
    name: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
};

interface IUpdate extends Partial<ICreate> {
    _id: string;
}

export const update = async (payload: IUpdate, signal: abortSignal = null) => {
    const dataFetch = await mfetch.setFetch({
        url: config.PATH_BASE_API + "user/update",
        requestInit: {
            method: "PUT",
            body: JSON.stringify(payload),
            signal
        }
    });
    return dataFetch;
};
