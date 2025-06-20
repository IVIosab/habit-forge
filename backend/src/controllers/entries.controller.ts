import { Request, Response } from "express"
import {
  dbGetUserEntries,
  dbGetEntryById,
  dbCreateUserHabitEntry,
  dbDeleteEntryById
} from "../db/queries/entries.query.js"

export async function getUserEntries(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.user?.id

  const entries = await dbGetUserEntries(userId)

  res.status(200).json(entries)
}

export async function getEntryById(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id

  const { entryId } = req.params
  const entry = await dbGetEntryById(entryId)
  if (!entry || entry.user_id !== userId) {
    console.log("getEntryById: Entry not found.")
    res.status(404).json({ message: "Entry not found" })
    return
  }

  res.status(200).json(entry)
}

export async function createUserHabitEntry(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.user?.id

  const { habit_id } = req.body
  if (!habit_id) {
    console.log("createUserHabitEntry: habit_id is required")
    res.status(400).json({ message: "habit_id is required" })
    return
  }

  const entry = await dbCreateUserHabitEntry(userId, habit_id)

  res.status(201).json(entry)
}

export async function deleteEntryById(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.user?.id

  const { entryId } = req.params
  if (!entryId) {
    console.log("deleteEntryById: entryId is required")
    res.status(400).json({ message: "entryId is required" })
    return
  }

  const entry = await dbGetEntryById(entryId)
  if (!entry || entry.user_id !== userId) {
    console.log("deleteEntryById: Entry not found or unauthorized.")
    res.status(404).json({ message: "Entry not found or unauthorized." })
    return
  }

  const deleted = await dbDeleteEntryById(entryId)

  res.status(204).send()
}
