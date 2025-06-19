"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Habit } from "./columns"

interface EditHabitDialogProps {
  habit: Habit
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onEditHabit: (id: string, name: string) => Promise<void>
}

export function EditHabitDialog({
  habit,
  isOpen,
  onOpenChange,
  onEditHabit
}: EditHabitDialogProps) {
  const [habitName, setHabitName] = React.useState(habit.name)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    setHabitName(habit.name)
  }, [habit.name])

  const handleEditHabit = async () => {
    if (!habitName.trim()) return

    setIsSubmitting(true)
    try {
      await onEditHabit(habit.id, habitName.trim())
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to edit habit:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditHabit()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
          <DialogDescription>
            Make changes to your habit. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-habit-name" className="text-right">
              Name
            </Label>
            <Input
              id="edit-habit-name"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="col-span-3"
              placeholder="Enter habit name..."
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleEditHabit}
            disabled={!habitName.trim() || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
