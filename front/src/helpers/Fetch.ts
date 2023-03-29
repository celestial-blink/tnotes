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
        return await this.run<IResponse<T>>();
    }

    async run<T>(): Promise<T> {
        let json: Object = {};
        try {
            const api = await fetch(this.url, this.requestInit);
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
};

export default Fetch;
