import { format, parseISO, startOfWeek, startOfMonth } from "date-fns"
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
  if (period === "week") {
    // Show individual days for week view
    return data.dailyStatus.map((item) => ({
      date: format(parseISO(item.date), "EEE"),
      completions: item.completed ? 1 : 0
    }))
  } else if (period === "month") {
    // Group by weeks for month view
    const weeklyData = new Map<string, number>()

    data.dailyStatus.forEach((item) => {
      const weekStart = startOfWeek(parseISO(item.date))
      const weekKey = format(weekStart, "MMM dd")

      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, 0)
      }

      if (item.completed) {
        weeklyData.set(weekKey, weeklyData.get(weekKey)! + 1)
      }
    })

    return Array.from(weeklyData.entries()).map(([date, completions]) => ({
      date,
      completions
    }))
  } else {
    // Group by months for year view
    const monthlyData = new Map<string, number>()

    data.dailyStatus.forEach((item) => {
      const monthStart = startOfMonth(parseISO(item.date))
      const monthKey = format(monthStart, "MMM yyyy")

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, 0)
      }

      if (item.completed) {
        monthlyData.set(monthKey, monthlyData.get(monthKey)! + 1)
      }
    })

    return Array.from(monthlyData.entries()).map(([date, completions]) => ({
      date,
      completions
    }))
  }
}

// Process all habits data for bar/line charts
export function processAllHabitsChartData(
  data: AllHabitsStatsResponse,
  period: TimePeriod
): ChartData[] {
  const habitNames = Object.keys(data.habits)
  if (habitNames.length === 0) return []

  // Collect all unique dates
  const allDates = new Set<string>()
  Object.values(data.habits).forEach((habitData) => {
    habitData.forEach((day) => allDates.add(day.date))
  })

  const sortedDates = Array.from(allDates).sort()

  if (period === "week") {
    // Show individual days for week view - count completed habits per day
    return sortedDates.map((date) => {
      let completedHabits = 0

      habitNames.forEach((habitName) => {
        const habitData = data.habits[habitName]
        const dayData = habitData.find((day) => day.date === date)
        if (dayData?.completed) {
          completedHabits++
        }
      })

      return {
        date: format(parseISO(date), "EEE"),
        completions: completedHabits
      }
    })
  } else if (period === "month") {
    // Group by weeks for month view
    const weeklyData = new Map<string, number>()

    sortedDates.forEach((date) => {
      const weekStart = startOfWeek(parseISO(date))
      const weekKey = format(weekStart, "MMM dd")

      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, 0)
      }

      let completedHabits = 0
      habitNames.forEach((habitName) => {
        const habitData = data.habits[habitName]
        const dayData = habitData.find((day) => day.date === date)
        if (dayData?.completed) {
          completedHabits++
        }
      })

      weeklyData.set(weekKey, weeklyData.get(weekKey)! + completedHabits)
    })

    return Array.from(weeklyData.entries()).map(([date, completions]) => ({
      date,
      completions
    }))
  } else {
    // Group by months for year view
    const monthlyData = new Map<string, number>()

    sortedDates.forEach((date) => {
      const monthStart = startOfMonth(parseISO(date))
      const monthKey = format(monthStart, "MMM yyyy")

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, 0)
      }

      let completedHabits = 0
      habitNames.forEach((habitName) => {
        const habitData = data.habits[habitName]
        const dayData = habitData.find((day) => day.date === date)
        if (dayData?.completed) {
          completedHabits++
        }
      })

      monthlyData.set(monthKey, monthlyData.get(monthKey)! + completedHabits)
    })

    return Array.from(monthlyData.entries()).map(([date, completions]) => ({
      date,
      completions
    }))
  }
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
