import { Express } from "express";
import note from "./note";
import task from "./task";
import user from "./user";
import auth from "./auth";

const router = (server: Express) => {
    server.use("/api/note", note);
    server.use("/api/task", task);
    server.use("/api/user", user);
    server.use("/api/auth", auth);
}

export default router;
