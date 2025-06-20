export interface Habit {
  id: string
  title: string
  description?: string
  priority: "none" | "low" | "medium" | "high"
  creation_date: string
  user_id: string
}

export interface HabitWithCompletion extends Habit {
  isCompleted: boolean
  entryId?: string
}
