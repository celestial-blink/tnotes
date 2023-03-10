import { env } from "process";

const config = {
    port: env.PORT || 1112,
    jwt_secret: env.JWT_SECRET,
    jwt_secret_refresh: env.JWT_SECRET_REFRESH
}

export default config;
