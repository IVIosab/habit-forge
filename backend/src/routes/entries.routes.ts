import { Router } from "express"
import {
  getUserEntries,
  getEntryById,
  createUserHabitEntry,
  deleteEntryById
} from "../controllers/entries.controller.js"

const router = Router()

router.get("/", getUserEntries)
router.get("/:entryId", getEntryById)
router.post("/", createUserHabitEntry)
router.delete("/:entryId", deleteEntryById)

export default router
