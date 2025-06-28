"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import type { Habit } from "@/types/Habit"
import type { TimePeriod } from "@/types/Statistics"

interface HabitSelectorProps {
  habits: Habit[]
  selectedHabitId: string
  onHabitChange: (habitId: string) => void
  timePeriod: TimePeriod
  onTimePeriodChange: (period: TimePeriod) => void
}

export function HabitSelector({
  habits,
  selectedHabitId,
  onHabitChange,
  timePeriod,
  onTimePeriodChange
}: HabitSelectorProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">Habit Statistics</h1>

      {/* Habit Selection */}
      <div className="w-full max-w-md">
        <Select value={selectedHabitId} onValueChange={onHabitChange}>
          <SelectTrigger className="w-80">
            <SelectValue placeholder="Select a habit to view statistics" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">All Habits</SelectItem>
            {habits
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((habit) => (
                <SelectItem key={habit.id} value={habit.id}>
                  {habit.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Time Period Selection */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Time Period:</span>
        <Select
          value={timePeriod}
          onValueChange={(value: TimePeriod) => onTimePeriodChange(value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
