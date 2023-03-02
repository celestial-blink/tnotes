import { Router, Request, Response } from "express";

const task: Router = Router();

task.get("/", (req: Request, res: Response) => {
    res.json({ saludo: "task" });
});

export default task;