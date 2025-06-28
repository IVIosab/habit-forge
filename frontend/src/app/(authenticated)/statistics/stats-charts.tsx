"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
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
import type { StatsData, TimePeriod } from "@/types/Statistics"
import {
  processSingleHabitData,
  processAllHabitsChartData,
  processSingleHabitPieData,
  processAllHabitsPieData
} from "@/lib/statistics-utils"

interface StatsChartsProps {
  statsData: StatsData
  timePeriod: TimePeriod
}

export function StatsCharts({ statsData, timePeriod }: StatsChartsProps) {
  const chartConfig = {
    completions: {
      label: "Completions",
      color: "hsl(0, 0%, 20%)" // Dark grey for consistency
    }
  }

  const getChartData = () => {
    if (statsData.isAllHabits && statsData.allHabitsData) {
      return processAllHabitsChartData(statsData.allHabitsData, timePeriod)
    } else if (statsData.singleHabitData) {
      return processSingleHabitData(statsData.singleHabitData, timePeriod)
    }
    return []
  }

  const getPieData = () => {
    if (statsData.isAllHabits && statsData.allHabitsData) {
      return processAllHabitsPieData(statsData.allHabitsData)
    } else if (statsData.singleHabitData) {
      return processSingleHabitPieData(statsData.singleHabitData)
    }
    return []
  }

  const chartData = getChartData()
  const pieData = getPieData()

  const getChartTitle = (type: "bar" | "line" | "pie") => {
    const baseTitle = statsData.isAllHabits
      ? "All Habits"
      : statsData.habitName || "Habit"

    switch (type) {
      case "bar":
        return `${baseTitle} - Bar Chart`
      case "line":
        return `${baseTitle} - Line Chart`
      case "pie":
        return statsData.isAllHabits
          ? "Completion Count by Habit"
          : "Completion Rate"
    }
  }

  const getChartDescription = (type: "bar" | "line" | "pie") => {
    const period = timePeriod
    const baseDesc = statsData.isAllHabits
      ? "perfect days"
      : statsData.habitName || "habit"

    switch (type) {
      case "bar":
      case "line":
        return statsData.isAllHabits
          ? `Days with all habits completed over the past ${period}`
          : `${baseDesc} completions over the past ${period}`
      case "pie":
        return statsData.isAllHabits
          ? `Total completions for each habit over the past ${period}`
          : `Days completed vs incomplete for ${baseDesc} over the past ${period}`
    }
  }

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{getChartTitle("bar")}</CardTitle>
          <CardDescription>{getChartDescription("bar")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="completions" fill="var(--color-completions)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{getChartTitle("line")}</CardTitle>
          <CardDescription>{getChartDescription("line")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
          <CardTitle>{getChartTitle("pie")}</CardTitle>
          <CardDescription>{getChartDescription("pie")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
    </div>
  )
}
