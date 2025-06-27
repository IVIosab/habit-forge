import type { HabitStats } from "@/types/Statistics"

const API_BASE = "http://localhost:3000/api"

export const statisticsApi = {
  async getHabitStats(habitId: string): Promise<HabitStats> {
    const res = await fetch(`${API_BASE}/stats/${habitId}`, {
      credentials: "include",
      cache: "no-store"
    })
    if (!res.ok) throw new Error("Failed to fetch habit statistics")
    const data = await res.json()
    return {
      habitId,
      completionDates: data
    }
  }
}
