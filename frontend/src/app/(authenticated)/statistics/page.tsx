"use client"

import { useState, useEffect } from "react"
import { habitApi } from "@/lib/apiClient"
import { statisticsApi } from "@/lib/apiStats"
import { HabitSelector } from "./habit-selector"
import { StatsCharts } from "./stats-charts"
import { StatsSummary } from "./stats-summary"
import type { Habit } from "@/types/Habit"
import type { TimePeriod, StatsData } from "@/types/Statistics"

export default function StatisticsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [selectedHabitId, setSelectedHabitId] = useState<string>("all")
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("week")
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch all habits on component mount
  useEffect(() => {
    async function fetchHabits() {
      try {
        const habitsData = await habitApi.getUserHabits()
        setHabits(habitsData)
      } catch (error) {
        console.error("Failed to fetch habits:", error)
      }
    }
    fetchHabits()
  }, [])

  // Fetch statistics when habit or time period changes
  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true)

        if (selectedHabitId === "all") {
          // Fetch all habits stats
          const allHabitsData =
            await statisticsApi.getAllHabitsStats(timePeriod)
          setStatsData({
            isAllHabits: true,
            allHabitsData
          })
        } else {
          // Fetch single habit stats
          const singleHabitData = await statisticsApi.getHabitStats(
            timePeriod,
            selectedHabitId
          )
          const selectedHabit = habits.find((h) => h.id === selectedHabitId)
          setStatsData({
            isAllHabits: false,
            singleHabitData,
            habitName: selectedHabit?.title
          })
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error)
        setStatsData(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (selectedHabitId === "all" || habits.length > 0) {
      fetchStats()
    }
  }, [selectedHabitId, timePeriod, habits])

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header and Selectors */}
        <HabitSelector
          habits={habits}
          selectedHabitId={selectedHabitId}
          onHabitChange={setSelectedHabitId}
          timePeriod={timePeriod}
          onTimePeriodChange={setTimePeriod}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading statistics...</div>
          </div>
        )}

        {/* Charts and Summary */}
        {!isLoading && statsData && (
          <div className="space-y-6">
            <StatsCharts statsData={statsData} timePeriod={timePeriod} />
            <StatsSummary statsData={statsData} timePeriod={timePeriod} />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && habits.length === 0 && selectedHabitId !== "all" && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-muted-foreground">No habits found.</div>
              <div className="text-sm text-muted-foreground mt-1">
                Create some habits first to view statistics.
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {!isLoading &&
          statsData &&
          ((statsData.isAllHabits &&
            statsData.allHabitsData &&
            Object.keys(statsData.allHabitsData).length === 0) ||
            (!statsData.isAllHabits &&
              statsData.singleHabitData &&
              statsData.singleHabitData.length === 0)) && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-muted-foreground">
                  No completion data found.
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Start completing habits to see statistics.
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
