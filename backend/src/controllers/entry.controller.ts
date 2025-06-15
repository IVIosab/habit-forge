import { Request, Response } from "express";
import {
    getAllEntries,
    getEntry,
    createEntryForHabit,
    updateEntry,
    deleteEntry,
} from "../db/queries/habit_entries.query.js";

// TEMP: hardcoded user ID for dev before auth is added
const FAKE_USER_ID = "EXAMPLE_USER_ID";

// GET /entries
export async function getEntries(req: Request, res: Response): Promise<void> {
    const entries = await getAllEntries();
    res.json(entries);
}

// GET /entries/:entryId → one entry by ID
export async function getEntryById(req: Request, res: Response): Promise<void> {
    const { entryId } = req.params;

    const entry = await getEntry(entryId);
    if (!entry) {
        res.status(404).json({ message: "Entry not found" });
        return;
    }

    res.json(entry);
}

// POST /entries → create 
export async function createEntry(req: Request, res: Response): Promise<void> {
    const { habit_id, completed } = req.body;

    if (!habit_id || typeof completed !== "boolean") {
        res.status(400).json({ message: "habit_id, created_at, and completed are required" });
        return;
    }

    const entry = await createEntryForHabit(
        FAKE_USER_ID,
        habit_id,
        completed
    );

    res.status(201).json(entry);
}

// PUT /entries/:entryId → update completed status
export async function updateEntryById(req: Request, res: Response): Promise<void> {
    const { entryId } = req.params;
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
        res.status(400).json({ message: "completed must be a boolean" });
        return;
    }

    const updated = await updateEntry(entryId, completed);
    if (!updated) {
        res.status(404).json({ message: "Entry not found" });
        return;
    }

    res.json(updated);
}

// DELETE /entries/:entryId
export async function deleteEntryById(req: Request, res: Response): Promise<void> {
    const { entryId } = req.params;

    const deleted = await deleteEntry(entryId);
    if (!deleted) {
        res.status(404).json({ message: "Entry not found" });
        return;
    }

    res.json({ message: "Entry deleted", deleted });
}
