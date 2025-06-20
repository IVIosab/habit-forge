import express from "express"
import {
  getUserHabits,
  getHabitById,
  createUserHabit,
  updateHabitById,
  deleteHabitById
} from "../controllers/habits.controller.js"

const router = express.Router()

router.get("/", getUserHabits)
router.get("/:id", getHabitById)
router.post("/", createUserHabit)
router.put("/:id", updateHabitById)
router.delete("/:id", deleteHabitById)

export default router
