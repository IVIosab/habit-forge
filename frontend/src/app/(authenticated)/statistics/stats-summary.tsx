"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StatsData, TimePeriod } from "@/types/Statistics"

interface StatsSummaryProps {
  statsData: StatsData
  timePeriod: TimePeriod
}

export function StatsSummary({ statsData, timePeriod }: StatsSummaryProps) {
  const getTotalCompletions = () => {
    if (statsData.isAllHabits && statsData.allHabitsData) {
      return statsData.allHabitsData.perfectDays
    } else if (statsData.singleHabitData) {
      return statsData.singleHabitData.totalCompletions
    }
    return 0
  }

  const getCurrentStreak = () => {
    if (statsData.isAllHabits && statsData.allHabitsData) {
      return statsData.allHabitsData.currentStreak
    } else if (statsData.singleHabitData) {
      return statsData.singleHabitData.currentStreak
    }
    return 0
  }

  const getLongestStreak = () => {
    if (statsData.isAllHabits && statsData.allHabitsData) {
      return statsData.allHabitsData.longestStreak
    } else if (statsData.singleHabitData) {
      return statsData.singleHabitData.longestStreak
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
