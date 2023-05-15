import { env } from "process";

interface IConfig {
    port: number;
    jwt_secret: string;
    jwt_secret_refresh: string;
    moongose_limit: number;
}

const config: IConfig = {
    port: parseInt(env?.PORT || "1112"),
    jwt_secret: env?.JWT_SECRET ?? "",
    jwt_secret_refresh: env?.JWT_SECRET_REFRESH ?? "",
    moongose_limit: 10
}

export default config;
