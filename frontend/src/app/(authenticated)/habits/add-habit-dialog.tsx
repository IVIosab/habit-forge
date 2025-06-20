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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

interface AddHabitDialogProps {
  onAddHabit: (data: {
    title: string
    description?: string
    priority?: string
  }) => Promise<void>
}

export function AddHabitDialog({ onAddHabit }: AddHabitDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    priority: "none"
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleAddHabit = async () => {
    if (!formData.title.trim() || formData.title.trim().length < 3) return

    setIsSubmitting(true)
    try {
      await onAddHabit({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority
      })
      setFormData({ title: "", description: "", priority: "none" })
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to add habit:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
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
            Create a new habit to track. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="habit-title" className="text-right">
              Title *
            </Label>
            <Input
              id="habit-title"
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
            <Label htmlFor="habit-description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="habit-description"
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
            <Label htmlFor="habit-priority" className="text-right">
              Priority
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, priority: value }))
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
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleAddHabit}
            disabled={
              !formData.title.trim() ||
              formData.title.trim().length < 3 ||
              isSubmitting
            }
          >
            {isSubmitting ? "Adding..." : "Add Habit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
