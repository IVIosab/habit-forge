import { format, parseISO } from "date-fns"
import type {
  ChartData,
  PieChartData,
  AllHabitsPieData,
  TimePeriod,
  SingleHabitStatsResponse,
  AllHabitsStatsResponse
} from "@/types/Statistics"

// Greyscale color palette for minimalistic design
const GREYSCALE_COLORS = [
  "hsl(0, 0%, 20%)", // Dark grey
  "hsl(0, 0%, 35%)", // Medium dark grey
  "hsl(0, 0%, 50%)", // Medium grey
  "hsl(0, 0%, 65%)", // Medium light grey
  "hsl(0, 0%, 80%)", // Light grey
  "hsl(0, 0%, 90%)" // Very light grey
]

// Process single habit data for charts
export function processSingleHabitData(
  data: SingleHabitStatsResponse,
  period: TimePeriod
): ChartData[] {
  return data.dailyStatus.map((item) => ({
    date: format(
      parseISO(item.date),
      period === "week" ? "EEE" : period === "month" ? "MMM dd" : "MMM yyyy"
    ),
    completions: item.completed ? 1 : 0
  }))
}

// Process all habits data for bar/line charts
export function processAllHabitsChartData(
  data: AllHabitsStatsResponse,
  period: TimePeriod
): ChartData[] {
  const habitNames = Object.keys(data.habits)
  if (habitNames.length === 0) return []

  const allDates = new Set<string>()

  // Collect all unique dates
  Object.values(data.habits).forEach((habitData) => {
    habitData.forEach((day) => allDates.add(day.date))
  })

  const sortedDates = Array.from(allDates).sort()

  return sortedDates.map((date) => {
    // Check if ALL habits were completed on this date
    const allCompleted = habitNames.every((habitName) => {
      const habitData = data.habits[habitName]
      const dayData = habitData.find((day) => day.date === date)
      return dayData?.completed === true
    })

    return {
      date: format(
        parseISO(date),
        period === "week" ? "EEE" : period === "month" ? "MMM dd" : "MMM yyyy"
      ),
      completions: allCompleted ? 1 : 0
    }
  })
}

// Process single habit pie chart data with greyscale colors
export function processSingleHabitPieData(
  data: SingleHabitStatsResponse
): PieChartData[] {
  const completed = data.totalCompletions
  const incomplete = data.dailyStatus.length - completed

  return [
    {
      name: "Completed",
      value: completed,
      fill: "hsl(0, 0%, 20%)" // Dark grey for completed
    },
    {
      name: "Incomplete",
      value: incomplete,
      fill: "hsl(0, 0%, 80%)" // Light grey for incomplete
    }
  ]
}

// Process all habits pie chart data with different greyscale colors for each habit
export function processAllHabitsPieData(
  data: AllHabitsStatsResponse
): AllHabitsPieData[] {
  return Object.entries(data.habits).map(([habitName, habitData], index) => {
    const completedCount = habitData.filter((day) => day.completed).length

    return {
      name: habitName,
      value: completedCount,
      fill: GREYSCALE_COLORS[index % GREYSCALE_COLORS.length]
    }
  })
}
