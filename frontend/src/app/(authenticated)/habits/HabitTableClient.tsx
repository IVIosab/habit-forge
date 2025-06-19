"use client"

import { useState, useEffect } from "react"
import type { Habit } from "./columns"
import { createColumns } from "./columns"
import { DataTable } from "./data-table"

export function HabitTableClient() {
  const [habits, setHabits] = useState<Habit[]>([])

  useEffect(() => {
    fetchHabits()
  }, [])

  async function fetchHabits() {
    const res = await fetch("http://localhost:3000/api/habits", {
      cache: "no-store",
      credentials: "include"
    })
    const habits = await res.json()
    setHabits(habits)
  }

  async function addHabit(name: string) {
    try {
      const res = await fetch("http://localhost:3000/api/habits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ name })
      })

      if (!res.ok) throw new Error("Failed to add habit.")

      const newHabit = await res.json()
      setHabits((prev) => [...prev, newHabit])
    } catch (err: any) {
      throw new Error(err.message || "Failed to add habit.")
    }
  }

  async function editHabit(id: string, name: string) {
    try {
      const res = await fetch(`http://localhost:3000/api/habits/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ name })
      })

      if (!res.ok) throw new Error("Failed to edit habit.")

      const updatedHabit = await res.json()
      setHabits((prev) =>
        prev.map((habit) => (habit.id === id ? updatedHabit : habit))
      )
    } catch (err: any) {
      throw new Error(err.message || "Failed to edit habit.")
    }
  }

  async function deleteHabit(id: string) {
    try {
      const res = await fetch(`http://localhost:3000/api/habits/${id}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (!res.ok) throw new Error("Failed to delete habit.")

      setHabits((prev) => prev.filter((habit) => habit.id !== id))
    } catch (err: any) {
      throw new Error(err.message || "Failed to delete habit.")
    }
  }

  const columns = createColumns({
    onEditHabit: editHabit,
    onDeleteHabit: deleteHabit
  })

  return <DataTable columns={columns} data={habits} onAddHabit={addHabit} />
}
