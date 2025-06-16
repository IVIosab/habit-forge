import { Request, Response } from "express";
import {
  getHabitsByUser,
  createHabitForUser,
  getHabit,
  updateHabitById,
  deleteHabitById,
} from "../db/queries/habits.query.js";

// GET /habits
export async function getAllHabits(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized: User not found." });
    return;
  }

  const habits = await getHabitsByUser(userId);
  res.json(habits);
}

// POST /habits
export async function createHabit(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  const { name } = req.body;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized: User not found." });
    return;
  }
  if (!name) {
    res.status(400).json({ message: "Habit name is required." });
    return;
  }

  const habit = await createHabitForUser(userId, name);
  res.status(201).json(habit);
}

// GET /habits/:id
export async function getHabitById(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  const habitId = req.params.id;
  const habit = await getHabit(habitId);

  if (!userId) {
    res.status(401).json({ message: "Unauthorized: User not found." });
    return;
  }
  if (!habit || habit.user_id !== userId) {
    res.status(404).json({ message: "Habit not found." });
    return;
  }

  res.json(habit);
}

// PUT /habits/:id
export async function updateHabit(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  const habitId = req.params.id;
  const { name } = req.body;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized: User not found." });
    return;
  }
  if (!name) {
    res.status(400).json({ message: "Name is required." });
    return;
  }

  const habit = await getHabit(habitId);
  if (!habit || habit.user_id !== userId) {
    res.status(404).json({ message: "Habit not found or unauthorized." });
    return;
  }

  const updated = await updateHabitById(habitId, name);
  res.json(updated);
}

// DELETE /habits/:id
export async function deleteHabit(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  const habitId = req.params.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized: User not found." });
    return;
  }
  const habit = await getHabit(habitId);
  if (!habit || habit.user_id !== userId) {
    res.status(404).json({ message: "Habit not found or unauthorized." });
    return;
  }

  await deleteHabitById(habitId);
  res.status(204).send();
}
