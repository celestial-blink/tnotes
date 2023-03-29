import cors from "cors";
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import express, { Express } from 'express';
import config from './config';
import router from './router';
import { connect } from './services/db';
import initialize from './passport';
import { logError, ornError, boomError, responseError } from './middleware/error';
import { auth } from "./middleware/auth";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(cors({
    origin(requestOrigin, callback) {
        if (["http://localhost:1111"].includes(requestOrigin ?? "") || !requestOrigin) {
            callback(null, true);
        } else {
            callback(new Error('no permitido'));
        }
    },
}));

connect().then(_ => {
    console.log("connected to mongo atlas!");
}).catch(err => {
    console.log(err, "mongo atlas error");
});

initialize();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auth);

router(app);

app.use(logError);
app.use(ornError);
app.use(boomError);
app.use(responseError);

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
