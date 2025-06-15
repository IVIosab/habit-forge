import { Router } from "express";
import {
    getEntries,
    createEntry,
    getEntryById,
    updateEntryById,
    deleteEntryById,
} from "../controllers/entry.controller.js";

const router = Router();

// GET /entries → get all entries
router.get("/entries", getEntries);

// POST /entries → create new entry
router.post("/entries", createEntry);

// GET /entries/:entryId → get one entry
router.get("/entries/:entryId", getEntryById);

// PUT /entries/:entryId → update entry
router.put("/entries/:entryId", updateEntryById);

// DELETE /entries/:entryId → delete entry
router.delete("/entries/:entryId", deleteEntryById);

export default router;
