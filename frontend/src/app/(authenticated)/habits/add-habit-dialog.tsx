"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AddHabitDialogProps {
  onAddHabit: (name: string) => Promise<void>
}

export function AddHabitDialog({ onAddHabit }: AddHabitDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [habitName, setHabitName] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleAddHabit = async () => {
    if (!habitName.trim()) return

    setIsSubmitting(true)
    try {
      await onAddHabit(habitName.trim())
      setHabitName("")
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to add habit:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddHabit()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
          <DialogDescription>
            Enter the name of your new habit. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="habit-name" className="text-right">
              Name
            </Label>
            <Input
              id="habit-name"
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
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleAddHabit}
            disabled={!habitName.trim() || isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Habit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
