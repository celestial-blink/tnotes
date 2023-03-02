import { Router, Request, Response } from "express";

const note: Router = Router();

note.get("/", (req: Request, res: Response) => {
    res.json({ saludo: "note" });
});

export default note;