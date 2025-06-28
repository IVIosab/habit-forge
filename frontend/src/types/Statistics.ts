export interface DayCompletion {
  date: string
  completed: boolean
}

export interface AllHabitsStats {
  [habitName: string]: DayCompletion[]
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

export interface AllHabitsPieData {
  name: string
  value: number
  fill: string
}

export type TimePeriod = "week" | "month" | "year"

export interface StatsData {
  isAllHabits: boolean
  singleHabitData?: DayCompletion[]
  allHabitsData?: AllHabitsStats
  habitName?: string
}
