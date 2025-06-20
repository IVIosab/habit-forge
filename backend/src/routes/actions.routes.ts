import { Router } from "express"
import {
  getUserIncompleteHabits,
  getUserCompleteHabits
} from "../controllers/actions.controller.js"

const router = Router()

router.get("/incomplete", getUserIncompleteHabits)
router.get("/complete", getUserCompleteHabits)

export default router
