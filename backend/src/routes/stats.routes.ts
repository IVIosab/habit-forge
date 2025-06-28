import { Router } from "express"
import {
  getStatsForPeriod,
  getStatsForPeriodHabit
} from "../controllers/stats.controller"

const router = Router()

router.get("/:period/:habitId", getStatsForPeriodHabit)
router.get("/:period", getStatsForPeriod)

export default router
