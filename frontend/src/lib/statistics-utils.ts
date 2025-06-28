import { format, parseISO } from "date-fns"
import type {
  ChartData,
  PieChartData,
  AllHabitsPieData,
  TimePeriod,
  DayCompletion,
  AllHabitsStats
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

// Process single habit data
export function processSingleHabitData(
  data: DayCompletion[],
  period: TimePeriod
): ChartData[] {
  return data.map((item) => ({
    date: format(
      parseISO(item.date),
      period === "week" ? "EEE" : period === "month" ? "MMM dd" : "MMM yyyy"
    ),
    completions: item.completed ? 1 : 0
  }))
}

// Process all habits data for bar/line charts
export function processAllHabitsChartData(
  data: AllHabitsStats,
  period: TimePeriod
): ChartData[] {
  const habitNames = Object.keys(data)
  if (habitNames.length === 0) return []

  const allDates = new Set<string>()

  // Collect all unique dates
  Object.values(data).forEach((habitData) => {
    habitData.forEach((day) => allDates.add(day.date))
  })

  const sortedDates = Array.from(allDates).sort()

  return sortedDates.map((date) => {
    // Check if ALL habits were completed on this date
    const allCompleted = habitNames.every((habitName) => {
      const habitData = data[habitName]
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
  data: DayCompletion[]
): PieChartData[] {
  const completed = data.filter((item) => item.completed).length
  const incomplete = data.length - completed

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
  data: AllHabitsStats
): AllHabitsPieData[] {
  return Object.entries(data).map(([habitName, habitData], index) => {
    const completedCount = habitData.filter((day) => day.completed).length

    return {
      name: habitName,
      value: completedCount,
      fill: GREYSCALE_COLORS[index % GREYSCALE_COLORS.length]
    }
  })
}

// Calculate current streak for single habit
export function calculateSingleHabitStreak(data: DayCompletion[]): number {
  if (data.length === 0) return 0

  const sortedData = data.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  let streak = 0
  for (const day of sortedData) {
    if (day.completed) {
      streak++
    } else {
      break
    }
  }

  return streak
}

// Calculate current streak for all habits (consecutive days where ALL habits were completed)
export function calculateAllHabitsCurrentStreak(data: AllHabitsStats): number {
  const habitNames = Object.keys(data)
  if (habitNames.length === 0) return 0

  // Get all dates and sort them descending
  const allDates = new Set<string>()
  Object.values(data).forEach((habitData) => {
    habitData.forEach((day) => allDates.add(day.date))
  })

  const sortedDates = Array.from(allDates).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )

  let streak = 0
  for (const date of sortedDates) {
    // Check if ALL habits were completed on this date
    const allCompleted = habitNames.every((habitName) => {
      const habitData = data[habitName]
      const dayData = habitData.find((day) => day.date === date)
      return dayData?.completed === true
    })

    if (allCompleted) {
      streak++
    } else {
      break
    }
  }

  return streak
}

// Calculate longest streak for single habit
export function calculateSingleHabitLongestStreak(
  data: DayCompletion[]
): number {
  if (data.length === 0) return 0

  const sortedData = data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  let maxStreak = 0
  let currentStreak = 0

  for (const day of sortedData) {
    if (day.completed) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }

  return maxStreak
}

// Calculate longest streak for all habits (consecutive days where ALL habits were completed)
export function calculateAllHabitsLongestStreak(data: AllHabitsStats): number {
  const habitNames = Object.keys(data)
  if (habitNames.length === 0) return 0

  // Get all dates and sort them ascending
  const allDates = new Set<string>()
  Object.values(data).forEach((habitData) => {
    habitData.forEach((day) => allDates.add(day.date))
  })

  const sortedDates = Array.from(allDates).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  let maxStreak = 0
  let currentStreak = 0

  for (const date of sortedDates) {
    // Check if ALL habits were completed on this date
    const allCompleted = habitNames.every((habitName) => {
      const habitData = data[habitName]
      const dayData = habitData.find((day) => day.date === date)
      return dayData?.completed === true
    })

    if (allCompleted) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }

  return maxStreak
}

// Calculate total days where ALL habits were completed (for All Habits view)
export function calculateAllHabitsCompletedDays(data: AllHabitsStats): number {
  const habitNames = Object.keys(data)
  if (habitNames.length === 0) return 0

  // Get all dates
  const allDates = new Set<string>()
  Object.values(data).forEach((habitData) => {
    habitData.forEach((day) => allDates.add(day.date))
  })

  let completedDays = 0
  for (const date of allDates) {
    // Check if ALL habits were completed on this date
    const allCompleted = habitNames.every((habitName) => {
      const habitData = data[habitName]
      const dayData = habitData.find((day) => day.date === date)
      return dayData?.completed === true
    })

    if (allCompleted) {
      completedDays++
    }
  }

  return completedDays
}
