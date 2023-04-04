import config from "@/config";
import Storage from "./Storage";

interface IParams {
    url: string;
    requestInit: RequestInit
};

interface IResponse<T> {
    state: boolean;
    data: T;
    message: string;
    optional: object;
};

class Fetch {
    private url: string = "";
    private requestInit: RequestInit | undefined = undefined;

    async setFetch<T>(payload: IParams): Promise<IResponse<T>> {
        this.url = payload.url;
        this.requestInit = payload.requestInit;
        if ((this.requestInit.method?.toLowerCase() ?? "") !== "get") {
            this.requestInit.body = JSON.stringify(this.requestInit.body);
        }
        return await this.run<IResponse<T>>();
    }

    private async run<T>(): Promise<T> {
        let json: Object = {};
        try {
            const api = await fetch(this.url, this.requestInit);
            if (api.status === 401) {
                const refresh = await this.refreshToken();
                if (refresh) this.run<IResponse<T>>();
            }
            json = await api.json();
        } catch (error) {
            console.error(error);
            json = {
                state: false,
                data: {},
                message: "",
                optional: {}
            }
        } finally {
            return json as T;
        }
    }

    private async refreshToken() {
        const mstorage = new Storage();
        const fetchData = await fetch(config.PATH_BASE_API + "refresh_token");
        const json = await fetchData.json();
        mstorage.setValue({
            key: "token",
            value: json.data.token
        });
        return json?.state ?? false;
    }
};

export default Fetch;
