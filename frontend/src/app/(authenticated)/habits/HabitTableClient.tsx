"use client"

import { useState, useEffect } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"

interface Habit {
  id: string
  user_id: string
  name: string
}

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

  return <DataTable columns={columns} data={habits} onAddHabit={addHabit} />
}
