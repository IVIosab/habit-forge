import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import habitsRouter from "./habits.routes.js"
import entriesRouter from "./entries.routes.js"
import actionsRouter from "./actions.routes.js"

const router = express.Router()

router.use(authMiddleware)

router.use("/habits", habitsRouter)
router.use("/entries", entriesRouter)
router.use("/actions", actionsRouter)

export default router
