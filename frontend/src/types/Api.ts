import { Entry, Habit } from "./index"

export interface ApiHabitResponse {
  habits: Habit
  entries: Entry | null
}
