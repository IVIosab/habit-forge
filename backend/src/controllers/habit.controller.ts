import { Request, Response, NextFunction } from "express";
import {
  getHabitsByUser,
  createHabitForUser,
  getHabit,
  updateHabitById,
  deleteHabitById,
} from "../db/queries/habits.query.js";
import { assert } from "console";

// Temporary hardcoded user ID
const mockUserId = "EXAMPLE_USER_ID";

// GET /habits
export async function getAllHabits(req: Request, res: Response) {
  const habits = await getHabitsByUser(mockUserId);
  res.json(habits);
}

// POST /habits
export async function createHabit(req: Request, res: Response) {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ message: "Habit name is required." });
    return;
  }

  const habit = await createHabitForUser(mockUserId, name);
  res.status(201).json(habit);
}

// GET /habits/:id
export async function getHabitById(req: Request, res: Response) {
  const habitId = req.params.id;
  const habit = await getHabit(habitId);

  if (!habit || habit.user_id !== mockUserId) {
    res.status(404).json({ message: "Habit not found." });
    return;
  }

  res.json(habit);
}

// PUT /habits/:id
export async function updateHabit(req: Request, res: Response) {
  const habitId = req.params.id;
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ message: "Name is required." });
    return;
  }

  const updated = await updateHabitById(habitId, name);

  res.json(updated);
}

// DELETE /habits/:id
export async function deleteHabit(req: Request, res: Response) {
  const habitId = req.params.id;

  const habit = await getHabit(habitId);
  if (!habit || habit.user_id !== mockUserId) {
    res.status(404).json({ message: "Habit not found or unauthorized." });
    return;
  }

  await deleteHabitById(habitId);

  res.status(204).send();
}
