import { Request, Response } from "express"
import {
  dbGetStatsForHabit,
  dbGetStatsForUser
} from "../db/queries/stats.query"
import { dbGetHabitById } from "../db/queries/habits.query"

export async function getStatsForPeriod(req: Request, res: Response) {
  const userId = req.user?.id

  if (!userId) {
    console.log("getStatsForWeek: User not found.")
    res.status(404).json({ message: "User not found." })
    return
  }

  const period = req.params.period

  if (period !== "week" && period !== "month" && period !== "year") {
    res.status(400).json({ message: "Invalid period." })
    return
  }

  const stats = await dbGetStatsForUser(period, userId)

  res.status(200).json(stats)
}

export async function getStatsForPeriodHabit(req: Request, res: Response) {
  const userId = req.user?.id

  if (!userId) {
    console.log("getStatsForWeek: User not found.")
    res.status(404).json({ message: "User not found." })
    return
  }

  const period = req.params.period
  const habitId = req.params.habitId

  if (period !== "week" && period !== "month" && period !== "year") {
    res.status(400).json({ message: "Invalid period." })
    return
  }

  const habit = await dbGetHabitById(habitId)
  if (!habit || habit.user_id !== userId) {
    console.log("getHabitById: Habit not found.")
    res.status(404).json({ message: "Habit not found." })
    return
  }

  const stats = await dbGetStatsForHabit(period, habitId)

  res.status(200).json(stats)
}
