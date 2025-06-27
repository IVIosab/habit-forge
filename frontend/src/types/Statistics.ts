export interface HabitStats {
  habitId: string
  completionDates: string[]
}

export interface ChartData {
  date: string
  completions: number
}

export interface PieChartData {
  name: string
  value: number
  fill: string
}

export type TimePeriod = "week" | "month" | "year"
