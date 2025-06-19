"use client"

import React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import type { Habit } from "./columns"

interface DeleteHabitDialogProps {
  habit: Habit
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onDeleteHabit: (id: string) => Promise<void>
}

export function DeleteHabitDialog({
  habit,
  isOpen,
  onOpenChange,
  onDeleteHabit
}: DeleteHabitDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDeleteHabit = async () => {
    setIsDeleting(true)
    try {
      await onDeleteHabit(habit.id)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to delete habit:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the habit
            "{habit.name}" and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteHabit}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
