"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StatsData, TimePeriod } from "@/types/Statistics"
import {
  calculateSingleHabitStreak,
  calculateSingleHabitLongestStreak,
  calculateAllHabitsCurrentStreak,
  calculateAllHabitsLongestStreak,
  processSingleHabitPieData
} from "@/lib/statistics-utils"

interface StatsSummaryProps {
  statsData: StatsData
  timePeriod: TimePeriod
}

export function StatsSummary({ statsData, timePeriod }: StatsSummaryProps) {
  const getTotalCompletions = () => {
    if (statsData.isAllHabits && statsData.allHabitsData) {
      return Object.values(statsData.allHabitsData).reduce(
        (total, habitData) => {
          return total + habitData.filter((day) => day.completed).length
        },
        0
      )
    } else if (statsData.singleHabitData) {
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

  const getCompletionRate = () => {
    if (statsData.isAllHabits) {
      return null // Don't show completion rate for all habits
    } else if (statsData.singleHabitData) {
      const pieData = processSingleHabitPieData(statsData.singleHabitData)
      if (pieData.length > 0) {
        const total = pieData[0].value + pieData[1].value
        return total > 0 ? Math.round((pieData[0].value / total) * 100) : 0
      }
    }
    return 0
  }

  const completionRate = getCompletionRate()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Total Completions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getTotalCompletions()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {statsData.isAllHabits
              ? "Longest Streak"
              : completionRate !== null
                ? "Completion Rate"
                : "Longest Streak"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statsData.isAllHabits
              ? `${getLongestStreak()} days`
              : completionRate !== null
                ? `${completionRate}%`
                : `${getLongestStreak()} days`}
          </div>
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
