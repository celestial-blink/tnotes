import config from "@/config";
import Storage from "./Storage";

const mstorage = new Storage();

interface IParams {
    url: string;
    requestInit: RequestInit
};

export interface IResponse<T> {
    state: boolean;
    data: T;
    message: string;
    optional?: object;
};

class Fetch {
    private url: string = "";
    private requestInit: RequestInit | undefined = undefined;

    async setFetch<T = any>(payload: IParams): Promise<IResponse<T>> {
        this.url = payload.url;
        this.requestInit = payload.requestInit;
        this.requestInit.headers = { ...(this.requestInit.headers ?? {}), 'Content-Type': 'application/json', 'Authorization': `Bearer ${mstorage.getValue("token")}` };
        this.requestInit.credentials = "same-origin";
        return await this.run<IResponse<T>>();
    }

    private async run<T = any>(): Promise<T> {
        try {
            const api = await fetch(this.url, this.requestInit);
            // if (!api.ok && api.status === 403) throw new Error(api.statusText || "Forbidden");
            // if (api.status === 401) {
            //     const refresh = await this.refreshToken();
            //     if (refresh) return this.run<IResponse<T>>() as T;
            // }
            const json = await api.json();
            const prepareResponse = { ...json };
            if (prepareResponse?.data.token) this.setRefreshToken(prepareResponse.data.token);
            return prepareResponse as T;
        } catch (error: Error | any) {
            console.error(error);
            const json = {
                state: false,
                data: {},
                message: error?.message ?? "",
                optional: {}
            }
            return { ...json } as T;
        }
    }

    private setRefreshToken(payload: string) {
        mstorage.setValue({
            key: "token",
            value: payload
        });
        if (this.requestInit) {
            this.requestInit.headers = { ...(this.requestInit?.headers ?? {}), 'Authorization': `Bearer ${payload}` };
        }
    }

    private async refreshToken() {
        const fetchData = await fetch(config.PATH_BASE_API + "auth/refresh_token");
        const json = await fetchData.json();
        if (json?.state) {
            mstorage.setValue({
                key: "token",
                value: json.data.token
            });
            if (this.requestInit) {
                this.requestInit.headers = { ...(this.requestInit?.headers ?? {}), 'Authorization': `Bearer ${json.data.token}` };
            }
            return json.state;
        }
        return false;
    }
};

export default Fetch;
