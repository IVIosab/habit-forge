import { and, eq, gte, SQL, sql } from "drizzle-orm"
import { db } from "../index.js"
import { entries } from "../schema/api/entries.js"
import { eachDayOfInterval, format, subDays } from "date-fns"
import { habits } from "../schema/index.js"

function translatePeriod(period: string): { sqlExpr: SQL; days: number } {
  if (period === "week") {
    return {
      sqlExpr: sql`datetime('now', '-7 days')`,
      days: 7
    }
  }
  if (period === "month") {
    return {
      sqlExpr: sql`datetime('now', '-30 days')`,
      days: 30
    }
  }
  if (period === "year") {
    return {
      sqlExpr: sql`datetime('now', '-365 days')`,
      days: 365
    }
  }

  throw new Error(`Unknown period: ${period}`)
}
export async function dbGetStatsForHabit(period: string, habitId: string) {
  const { sqlExpr, days } = translatePeriod(period)

  // Step 1: Get completion dates from DB
  const result = await db
    .select({ completion_date: entries.completion_date })
    .from(entries)
    .where(
      and(eq(entries.habit_id, habitId), gte(entries.completion_date, sqlExpr))
    )

  // Step 2: Convert completion timestamps to a Set of "YYYY-MM-DD"
  const completedDates = new Set(
    result.map((r) => r.completion_date.slice(0, 10)) // truncate to date
  )

  // Step 3: Generate list of last N days
  const today = new Date()
  const startDate = subDays(today, days - 1)
  const allDates = eachDayOfInterval({ start: startDate, end: today })

  // Step 4: Compute streaks and completion stats
  let totalCompletions = 0
  let longestStreak = 0
  let currentStreak = 0
  let streakCounter = 0

  for (let i = allDates.length - 1; i >= 0; i--) {
    const dateStr = format(allDates[i], "yyyy-MM-dd")
    const completed = completedDates.has(dateStr)

    if (completed) {
      totalCompletions++
      streakCounter++

      // Update current streak if we're still at the end
      if (i === allDates.length - 1 || currentStreak === streakCounter - 1) {
        currentStreak = streakCounter
      }
    } else {
      streakCounter = 0
    }

    longestStreak = Math.max(longestStreak, streakCounter)
  }

  // Step 5: Build daily completion map
  const dailyStatus = allDates.map((date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return {
      date: dateStr,
      completed: completedDates.has(dateStr)
    }
  })

  return {
    dailyStatus,
    totalCompletions,
    longestStreak,
    currentStreak
  }
}

export async function dbGetStatsForUser(period: string, userId: string) {
  const { sqlExpr, days } = translatePeriod(period)

  // Step 1: Fetch entries joined with habits (innerJoin keeps only entries that exist)
  const rows = await db
    .select({
      habitId: habits.id,
      habitTitle: habits.title,
      completionDate: entries.completion_date
    })
    .from(entries)
    .innerJoin(habits, eq(entries.habit_id, habits.id))
    .where(
      and(eq(habits.user_id, userId), gte(entries.completion_date, sqlExpr))
    )

  // Step 2: Get list of all habits for this user
  const allHabits = await db
    .select({ id: habits.id, title: habits.title })
    .from(habits)
    .where(eq(habits.user_id, userId))

  const habitIds = allHabits.map((h) => h.id)
  const habitTitles = new Map(allHabits.map((h) => [h.id, h.title]))

  // Step 3: Group completion dates by habit ID
  const grouped: Map<string, Set<string>> = new Map()

  for (const { habitId, completionDate } of rows) {
    const dateStr = completionDate.slice(0, 10)
    if (!grouped.has(habitId)) {
      grouped.set(habitId, new Set())
    }
    grouped.get(habitId)!.add(dateStr)
  }

  // Step 4: Generate the list of dates in the period
  const today = new Date()
  const startDate = subDays(today, days - 1)
  const allDates = eachDayOfInterval({ start: startDate, end: today })
  const formattedDates = allDates.map((d) => format(d, "yyyy-MM-dd"))

  // Step 5: Build per-habit status map
  const result: Record<string, { date: string; completed: boolean }[]> = {}

  for (const habitId of habitIds) {
    const title = habitTitles.get(habitId)!
    const completedSet = grouped.get(habitId) || new Set()
    result[title] = formattedDates.map((date) => ({
      date,
      completed: completedSet.has(date)
    }))
  }

  // Step 6: Calculate perfect days and streaks
  let perfectDays = 0
  let longestStreak = 0
  let currentStreak = 0
  let streakCounter = 0

  for (let i = formattedDates.length - 1; i >= 0; i--) {
    const date = formattedDates[i]

    const isPerfect = habitIds.every((habitId) =>
      grouped.get(habitId)?.has(date)
    )

    if (isPerfect) {
      perfectDays++
      streakCounter++

      if (
        i === formattedDates.length - 1 ||
        currentStreak === streakCounter - 1
      ) {
        currentStreak = streakCounter
      }
    } else {
      streakCounter = 0
    }

    longestStreak = Math.max(longestStreak, streakCounter)
  }

  return {
    habits: result,
    perfectDays,
    longestStreak,
    currentStreak
  }
}
