import { Express } from "express";
import note from "./note";
import task from "./task";
import user from "./user";
import auth from "./auth";

const router = (server: Express) => {
    server.use("/note", note);
    server.use("/task", task);
    server.use("/user", user);
    server.use("/auth", auth);
}

export default router;
