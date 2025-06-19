import express from "express";
import statsRouter from "./stats.routes.js";
import habitRouter from "./habit.routes.js";
import entryRouter from "./entry.routes.js";

const router = express.Router();

router.use(statsRouter);
router.use(habitRouter);
router.use(entryRouter);

export default router;
