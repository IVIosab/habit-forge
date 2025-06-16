import express, { Request, Response } from "express";
import router from "./routes/index.js";
import { logger } from "./middlewares/logging.middleware.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/api", router);

app.get("/api", (req: Request, res: Response) => {
    res.send("Welcome to LinkNest API!");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
