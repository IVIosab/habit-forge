import {
  format,
  subDays,
  subMonths,
  subYears,
  eachDayOfInterval,
  startOfDay,
  parseISO
} from "date-fns"
import type { ChartData, PieChartData, TimePeriod } from "@/types/Statistics"

export function getDateRange(period: TimePeriod): { start: Date; end: Date } {
  const end = new Date()
  let start: Date

  switch (period) {
    case "week":
      start = subDays(end, 7)
      break
    case "month":
      start = subMonths(end, 1)
      break
    case "year":
      start = subYears(end, 1)
      break
  }

  return { start, end }
}

export function processCompletionData(
  completionDates: string[],
  period: TimePeriod
): ChartData[] {
  const { start, end } = getDateRange(period)

  // Parse completion dates
  const completions = completionDates.map((date) => startOfDay(parseISO(date)))

  // Get all days in the range
  const allDays = eachDayOfInterval({ start, end })

  // Count completions per day
  const dailyCompletions = allDays.map((day) => {
    const dayStart = startOfDay(day)
    const count = completions.filter(
      (completion) => completion.getTime() === dayStart.getTime()
    ).length

    return {
      date: format(
        day,
        period === "week" ? "EEE" : period === "month" ? "MMM dd" : "MMM yyyy"
      ),
      completions: count
    }
  })

  return dailyCompletions
}

export function processPieChartData(
  completionDates: string[],
  period: TimePeriod
): PieChartData[] {
  const { start, end } = getDateRange(period)
  const totalDays = eachDayOfInterval({ start, end }).length

  // Parse completion dates and filter for the period
  const completions = completionDates
    .map((date) => parseISO(date))
    .filter((date) => date >= start && date <= end)

  const completedDays = new Set(
    completions.map((date) => format(startOfDay(date), "yyyy-MM-dd"))
  ).size
  const incompleteDays = totalDays - completedDays

  return [
    {
      name: "Completed",
      value: completedDays,
      fill: "hsl(var(--chart-1))"
    },
    {
      name: "Incomplete",
      value: incompleteDays,
      fill: "hsl(var(--chart-2))"
    }
  ]
}
