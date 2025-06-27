import { Router } from "express"
import { getStatsForHabit } from "../controllers/stats.controller"

const router = Router()

router.get("/:habitId", getStatsForHabit)

export default router
