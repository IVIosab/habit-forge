"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StatsData, TimePeriod } from "@/types/Statistics"
import {
  calculateSingleHabitStreak,
  calculateSingleHabitLongestStreak,
  calculateAllHabitsCurrentStreak,
  calculateAllHabitsLongestStreak,
  calculateAllHabitsCompletedDays
} from "@/lib/statistics-utils"

interface StatsSummaryProps {
  statsData: StatsData
  timePeriod: TimePeriod
}

export function StatsSummary({ statsData, timePeriod }: StatsSummaryProps) {
  const getTotalCompletions = () => {
    if (statsData.isAllHabits && statsData.allHabitsData) {
      // For All Habits: count days where ALL habits were completed
      return calculateAllHabitsCompletedDays(statsData.allHabitsData)
    } else if (statsData.singleHabitData) {
      // For single habit: count completed days
      return statsData.singleHabitData.filter((day) => day.completed).length
    }
    return 0
  }

  const getCurrentStreak = () => {
    if (statsData.isAllHabits && statsData.allHabitsData) {
      return calculateAllHabitsCurrentStreak(statsData.allHabitsData)
    } else if (statsData.singleHabitData) {
      return calculateSingleHabitStreak(statsData.singleHabitData)
    }
    return 0
  }

  const getLongestStreak = () => {
    if (statsData.isAllHabits && statsData.allHabitsData) {
      return calculateAllHabitsLongestStreak(statsData.allHabitsData)
    } else if (statsData.singleHabitData) {
      return calculateSingleHabitLongestStreak(statsData.singleHabitData)
    }
    return 0
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {statsData.isAllHabits ? "Perfect Days" : "Total Completions"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getTotalCompletions()}</div>
          {statsData.isAllHabits && (
            <div className="text-xs text-muted-foreground mt-1">
              Days with all habits completed
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getLongestStreak()} days</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getCurrentStreak()} days</div>
        </CardContent>
      </Card>
    </div>
  )
}
