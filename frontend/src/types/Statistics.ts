export interface DayCompletion {
  date: string
  completed: boolean
}

export interface SingleHabitStatsResponse {
  dailyStatus: DayCompletion[]
  totalCompletions: number
  longestStreak: number
  currentStreak: number
}

export interface AllHabitsStatsResponse {
  habits: {
    [habitName: string]: DayCompletion[]
  }
  perfectDays: number
  longestStreak: number
  currentStreak: number
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
  singleHabitData?: SingleHabitStatsResponse
  allHabitsData?: AllHabitsStatsResponse
  habitName?: string
}
