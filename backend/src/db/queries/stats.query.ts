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
  const startDate = subDays(today, days - 1) // inclusive range
  const allDates = eachDayOfInterval({ start: startDate, end: today })

  // Step 4: Return completion status per day
  return allDates.map((date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return {
      date: dateStr,
      completed: completedDates.has(dateStr)
    }
  })
}

export async function dbGetStatsForUser(period: string, userId: string) {
  const { sqlExpr, days } = translatePeriod(period)

  // Step 1: Fetch entries joined with habits (innerJoin keeps only entries that exist)
  const rows = await db
    .select({
      habitTitle: habits.title,
      completionDate: entries.completion_date
    })
    .from(entries)
    .innerJoin(habits, eq(entries.habit_id, habits.id))
    .where(
      and(eq(habits.user_id, userId), gte(entries.completion_date, sqlExpr))
    )

  // Step 2: Group completion dates by habit name
  const grouped: Map<string, Set<string>> = new Map()

  for (const { habitTitle, completionDate } of rows) {
    const dateStr = completionDate.slice(0, 10) // 'YYYY-MM-DD'
    if (!grouped.has(habitTitle)) {
      grouped.set(habitTitle, new Set())
    }
    grouped.get(habitTitle)!.add(dateStr)
  }

  // Step 3: Generate the list of dates for the period
  const today = new Date()
  const startDate = subDays(today, days - 1)
  const allDates = eachDayOfInterval({ start: startDate, end: today })
  const formattedDates = allDates.map((d) => format(d, "yyyy-MM-dd"))

  // Step 4: Build final output
  const result: Record<string, { date: string; completed: boolean }[]> = {}

  for (const [habitName, completedSet] of grouped.entries()) {
    result[habitName] = formattedDates.map((date) => ({
      date,
      completed: completedSet.has(date)
    }))
  }

  return result
}
