import { Request, Response } from "express"
import { dbGetStatsForHabit } from "../db/queries/stats.query"

const getStatsForHabit = async (req: Request, res: Response) => {
  const { habitId } = req.params

  const stats = await dbGetStatsForHabit(habitId)

  res.status(200).json(stats)
}

export { getStatsForHabit }
