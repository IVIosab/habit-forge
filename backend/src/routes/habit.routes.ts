import express from "express";
// import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createHabit,
  deleteHabit,
  getAllHabits,
  getHabitById,
  updateHabit,
} from "../controllers/habit.controller.js";

const router = express.Router();

// Apply auth middleware to all /habits routes
// router.use("/habits", authMiddleware);

// GET /habits → get all habits for current user
router.get("/habits", getAllHabits);

// POST /habits → create new habit
router.post("/habits", createHabit);

// GET /habits/:id → get one habit by id
router.get("/habits/:id", updateHabit);

// PUT /habits/:id → update habit name (optional)
router.put("/habits/:id", updateHabit);

// DELETE /habits/:id → delete habit
router.delete("/habits/:id", deleteHabit);

export default router;
