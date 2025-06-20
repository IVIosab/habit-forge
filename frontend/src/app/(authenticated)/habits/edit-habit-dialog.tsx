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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import type { Habit } from "@/types"

interface EditHabitDialogProps {
  habit: Habit
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onEditHabit: (
    id: string,
    data: { title: string; description?: string; priority?: string }
  ) => Promise<void>
}

export function EditHabitDialog({
  habit,
  isOpen,
  onOpenChange,
  onEditHabit
}: EditHabitDialogProps) {
  const [formData, setFormData] = React.useState({
    title: habit.title,
    description: habit.description || "",
    priority: habit.priority
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    setFormData({
      title: habit.title,
      description: habit.description || "",
      priority: habit.priority
    })
  }, [habit])

  const handleEditHabit = async () => {
    if (!formData.title.trim() || formData.title.trim().length < 3) return

    setIsSubmitting(true)
    try {
      await onEditHabit(habit.id, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to edit habit:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
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
            <Label htmlFor="edit-habit-title" className="text-right">
              Title *
            </Label>
            <Input
              id="edit-habit-title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="col-span-3"
              placeholder="Enter habit title..."
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="edit-habit-description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="edit-habit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value
                }))
              }
              className="col-span-3"
              placeholder="Optional description..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-habit-priority" className="text-right">
              Priority
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, priority: value as any }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
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
            disabled={
              !formData.title.trim() ||
              formData.title.trim().length < 3 ||
              isSubmitting
            }
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
