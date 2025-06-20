import { Request, Response } from "express"
import {
  dbGetUserHabits,
  dbGetHabitById,
  dbCreateUserHabit,
  dbUpdateHabitById,
  dbDeleteHabitById
} from "../db/queries/habits.query.js"

export async function getUserHabits(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.user?.id

  const habits = await dbGetUserHabits(userId)

  res.status(200).json(habits)
}

export async function getHabitById(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id

  const habitId = req.params.id
  const habit = await dbGetHabitById(habitId)
  if (!habit || habit.user_id !== userId) {
    console.log("getHabitById: Habit not found.")
    res.status(404).json({ message: "Habit not found." })
    return
  }

  res.status(200).json(habit)
}

export async function createUserHabit(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.user?.id

  const { title, description, priority } = req.body
  if (!title) {
    console.log("createUserHabit: Habit title is required.")
    res.status(400).json({ message: "Habit title is required." })
    return
  }

  const habit = await dbCreateUserHabit(userId, title, description, priority)

  res.status(201).json(habit)
}

export async function updateHabitById(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.user?.id

  const { title, description, priority } = req.body
  if (!title) {
    console.log("createUserHabit: Habit title is required.")
    res.status(400).json({ message: "Habit title is required." })
    return
  }

  const habitId = req.params.id
  const habit = await dbGetHabitById(habitId)
  if (!habit || habit.user_id !== userId) {
    console.log("updateHabitById: Habit not found or unauthorized.")
    res.status(404).json({ message: "Habit not found or unauthorized." })
    return
  }

  const updated = await dbUpdateHabitById(habitId, title, description, priority)
  res.status(201).json(updated)
}

export async function deleteHabitById(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.user?.id

  const habitId = req.params.id
  const habit = await dbGetHabitById(habitId)
  if (!habit || habit.user_id !== userId) {
    console.log("deleteHabitById: Habit not found or unauthorized.")
    res.status(404).json({ message: "Habit not found or unauthorized." })
    return
  }

  await dbDeleteHabitById(habitId)

  res.status(204).send()
}
