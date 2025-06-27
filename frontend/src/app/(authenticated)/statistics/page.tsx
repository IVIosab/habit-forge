"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"
import { habitApi } from "@/lib/apiClient"
import { statisticsApi } from "@/lib/apiStats"
import {
  processCompletionData,
  processPieChartData
} from "@/lib/statistics-utils"
import type { Habit } from "@/types/Habit"
import type { HabitStats, TimePeriod } from "@/types/Statistics"
import { parseISO, startOfDay, subDays } from "date-fns"

export default function StatisticsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [selectedHabitId, setSelectedHabitId] = useState<string>("")
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month")
  const [stats, setStats] = useState<HabitStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch all habits on component mount
  useEffect(() => {
    async function fetchHabits() {
      try {
        const habitsData = await habitApi.getUserHabits()
        setHabits(habitsData)
        if (habitsData.length > 0) {
          setSelectedHabitId(habitsData[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch habits:", error)
      }
    }
    fetchHabits()
  }, [])

  // Fetch statistics when habit or time period changes
  useEffect(() => {
    async function fetchStats() {
      if (!selectedHabitId) return

      try {
        setIsLoading(true)
        const statsData = await statisticsApi.getHabitStats(selectedHabitId)
        setStats(statsData)
      } catch (error) {
        console.error("Failed to fetch statistics:", error)
        setStats(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [selectedHabitId])

  const selectedHabit = habits.find((h) => h.id === selectedHabitId)
  const chartData = stats
    ? processCompletionData(stats.completionDates, timePeriod)
    : []
  const pieData = stats
    ? processPieChartData(stats.completionDates, timePeriod)
    : []

  const chartConfig = {
    completions: {
      label: "Completions",
      color: "hsl(var(--chart-1))"
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-2xl font-bold">Habit Statistics</h1>

          {/* Habit Selection */}
          <div className="w-full max-w-md">
            <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Select a habit to view statistics" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {habits
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((habit) => (
                    <SelectItem key={habit.id} value={habit.id}>
                      {habit.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Period Selection */}
          {selectedHabitId && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Time Period:</span>
              <Select
                value={timePeriod}
                onValueChange={(value: TimePeriod) => setTimePeriod(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading statistics...</div>
          </div>
        )}

        {/* Charts */}
        {!isLoading && selectedHabit && stats && (
          <div className="space-y-6">
            {/* Bar Chart */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Daily Completions - Bar Chart</CardTitle>
                <CardDescription>
                  {selectedHabit.title} completions over the past {timePeriod}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="completions"
                        fill="var(--color-completions)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Line Chart */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Daily Completions - Line Chart</CardTitle>
                <CardDescription>
                  Trend of {selectedHabit.title} completions over the past{" "}
                  {timePeriod}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="completions"
                        stroke="var(--color-completions)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-completions)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Completion Rate</CardTitle>
                <CardDescription>
                  Days completed vs incomplete for {selectedHabit.title} over
                  the past {timePeriod}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) =>
                          `${name}: ${value} (${percent ? (percent * 100).toFixed(0) : 0}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Completions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {pieData[0]?.value || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {pieData.length > 0
                      ? `${Math.round((pieData[0].value / (pieData[0].value + pieData[1].value)) * 100)}%`
                      : "0%"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {/* Calculate current streak */}
                    {stats
                      ? calculateCurrentStreak(stats.completionDates)
                      : 0}{" "}
                    days
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && habits.length === 0 && (
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
          selectedHabit &&
          stats &&
          stats.completionDates.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-muted-foreground">
                  No completion data found.
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Start completing "{selectedHabit.title}" to see statistics.
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

// Helper function to calculate current streak
function calculateCurrentStreak(completionDates: string[]): number {
  if (completionDates.length === 0) return 0

  const dates = completionDates
    .map((date) => parseISO(date))
    .sort((a, b) => b.getTime() - a.getTime()) // Sort descending

  let streak = 0
  let currentDate = startOfDay(new Date())

  for (const completionDate of dates) {
    const completionDay = startOfDay(completionDate)

    if (completionDay.getTime() === currentDate.getTime()) {
      streak++
      currentDate = subDays(currentDate, 1)
    } else if (completionDay.getTime() < currentDate.getTime()) {
      break
    }
  }

  return streak
}
