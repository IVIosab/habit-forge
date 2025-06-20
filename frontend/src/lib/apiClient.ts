import type {
  Habit,
  Entry,
  HabitWithCompletion,
  ApiHabitResponse
} from "@/types"

const API_BASE = "http://localhost:3000/api"

// Helper function to transform API response to our expected format
function transformHabitResponse(
  apiResponse: ApiHabitResponse
): HabitWithCompletion {
  const habit = apiResponse.habits
  return {
    id: habit.id,
    title: habit.title,
    description: habit.description,
    priority: habit.priority,
    creation_date: habit.creation_date,
    user_id: habit.user_id,
    isCompleted: apiResponse.entries !== null,
    entryId: apiResponse.entries?.id
  }
}

export const habitApi = {
  // Habits
  async getUserHabits(): Promise<Habit[]> {
    const res = await fetch(`${API_BASE}/habits/`, {
      credentials: "include",
      cache: "no-store"
    })
    if (!res.ok) throw new Error("Failed to fetch habits")
    return res.json()
  },

  async createUserHabit(data: {
    title: string
    description?: string
    priority?: string
  }): Promise<Habit> {
    const res = await fetch(`${API_BASE}/habits/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error("Failed to create habit")
    return res.json()
  },

  async updateHabitById(
    id: string,
    data: { title: string; description?: string; priority?: string }
  ): Promise<Habit> {
    const res = await fetch(`${API_BASE}/habits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error("Failed to update habit")
    return res.json()
  },

  async deleteHabitById(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/habits/${id}`, {
      method: "DELETE",
      credentials: "include"
    })
    if (!res.ok) throw new Error("Failed to delete habit")
  },

  // Entries
  async createUserHabitEntry(habitId: string): Promise<Entry> {
    const res = await fetch(`${API_BASE}/entries/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ habit_id: habitId })
    })
    if (!res.ok) throw new Error("Failed to create entry")
    return res.json()
  },

  async deleteEntryById(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/entries/${id}`, {
      method: "DELETE",
      credentials: "include"
    })
    if (!res.ok) throw new Error("Failed to delete entry")
  },

  // Actions - Transform the nested API response to flat structure
  async getUserIncompleteHabits(): Promise<HabitWithCompletion[]> {
    const res = await fetch(`${API_BASE}/actions/incomplete`, {
      credentials: "include",
      cache: "no-store"
    })
    if (!res.ok) throw new Error("Failed to fetch incomplete habits")
    const data: ApiHabitResponse[] = await res.json()
    console.log("Raw incomplete habits API response:", data)

    const transformedData = data.map(transformHabitResponse)
    console.log("Transformed incomplete habits:", transformedData)

    return transformedData
  },

  async getUserCompleteHabits(): Promise<HabitWithCompletion[]> {
    const res = await fetch(`${API_BASE}/actions/complete`, {
      credentials: "include",
      cache: "no-store"
    })
    if (!res.ok) throw new Error("Failed to fetch complete habits")
    const data: ApiHabitResponse[] = await res.json()
    console.log("Raw complete habits API response:", data)

    const transformedData = data.map(transformHabitResponse)
    console.log("Transformed complete habits:", transformedData)

    return transformedData
  }
}
