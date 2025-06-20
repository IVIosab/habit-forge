"use client"

import { useState, useEffect } from "react"
import { habitApi } from "@/lib/apiClient"
import { createHabitColumns } from "./habit-columns"
import { HabitDataTable } from "./habit-data-table"
import type { HabitWithCompletion } from "@/types"

export function HabitsClient() {
  const [incompleteHabits, setIncompleteHabits] = useState<
    HabitWithCompletion[]
  >([])
  const [completeHabits, setCompleteHabits] = useState<HabitWithCompletion[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchHabits()
  }, [])

  async function fetchHabits() {
    try {
      setIsLoading(true)
      const [incomplete, complete] = await Promise.all([
        habitApi.getUserIncompleteHabits(),
        habitApi.getUserCompleteHabits()
      ])

      console.log("Fetched incomplete habits:", incomplete)
      console.log("Fetched complete habits:", complete)

      setIncompleteHabits(incomplete)
      setCompleteHabits(complete)
    } catch (error) {
      console.error("Failed to fetch habits:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function addHabit(data: {
    title: string
    description?: string
    priority?: string
  }) {
    try {
      await habitApi.createUserHabit(data)
      await fetchHabits() // Refresh both lists
    } catch (error) {
      console.error("Failed to add habit:", error)
      throw error
    }
  }

  async function editHabit(
    id: string,
    data: { title: string; description?: string; priority?: string }
  ) {
    try {
      await habitApi.updateHabitById(id, data)
      await fetchHabits() // Refresh both lists
    } catch (error) {
      console.error("Failed to edit habit:", error)
      throw error
    }
  }

  async function deleteHabit(id: string) {
    try {
      await habitApi.deleteHabitById(id)
      await fetchHabits() // Refresh both lists
    } catch (error) {
      console.error("Failed to delete habit:", error)
      throw error
    }
  }

  async function toggleCompletion(
    habitId: string,
    isCompleted: boolean,
    entryId?: string
  ) {
    try {
      if (isCompleted) {
        // Mark as complete - create entry
        await habitApi.createUserHabitEntry(habitId)
      } else {
        // Mark as incomplete - delete entry
        if (entryId) {
          await habitApi.deleteEntryById(entryId)
        }
      }
      await fetchHabits() // Refresh both lists
    } catch (error) {
      console.error("Failed to toggle completion:", error)
    }
  }

  const columns = createHabitColumns({
    onEditHabit: editHabit,
    onDeleteHabit: deleteHabit,
    onToggleCompletion: toggleCompletion
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading habits...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <HabitDataTable
        columns={columns}
        data={incompleteHabits}
        onAddHabit={addHabit}
        title="Today's Habits"
      />

      <HabitDataTable
        columns={columns}
        data={completeHabits}
        title="Completed Habits"
      />
    </div>
  )
}
