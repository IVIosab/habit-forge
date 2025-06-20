import { Request, Response } from "express"
import {
  dbGetUserIncompleteHabits,
  dbGetUserCompleteHabits
} from "../db/queries/actions.query.js"

const getUserIncompleteHabits = async (req: Request, res: Response) => {
  const userId = req.user?.id

  const habits = await dbGetUserIncompleteHabits(userId)

  res.status(200).json(habits)
}

const getUserCompleteHabits = async (req: Request, res: Response) => {
  const userId = req.user?.id

  const habits = await dbGetUserCompleteHabits(userId)

  res.status(200).json(habits)
}

export { getUserIncompleteHabits, getUserCompleteHabits }
