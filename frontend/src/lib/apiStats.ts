import type {
  SingleHabitStatsResponse,
  AllHabitsStatsResponse,
  TimePeriod
} from "@/types/Statistics"

const API_BASE = "http://localhost:3000/api"

export const statisticsApi = {
  async getHabitStats(
    period: TimePeriod,
    habitId: string
  ): Promise<SingleHabitStatsResponse> {
    const res = await fetch(`${API_BASE}/stats/${period}/${habitId}`, {
      credentials: "include",
      cache: "no-store"
    })
    if (!res.ok) throw new Error("Failed to fetch habit statistics")
    return res.json()
  },

  async getAllHabitsStats(period: TimePeriod): Promise<AllHabitsStatsResponse> {
    const res = await fetch(`${API_BASE}/stats/${period}`, {
      credentials: "include",
      cache: "no-store"
    })
    if (!res.ok) throw new Error("Failed to fetch all habits statistics")
    return res.json()
  }
}
