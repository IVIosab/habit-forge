import { db } from "./index"
import { nanoid } from "nanoid"
import { addDays, isBefore, parseISO, format } from "date-fns"
import { habits, entries } from "./schema"

const baseUrl = "http://localhost:3000"

async function waitForServer(
  url: string,
  retries = 20,
  delay = 500
): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch (_) {}
    await new Promise((res) => setTimeout(res, delay))
  }
  throw new Error("Server not responding at " + url)
}

const main = async () => {
  //   await waitForServer(`${baseUrl}/api/health`) // Adjust if you don't have a health endpoint

  // 1. Register the user via API
  const registerRes = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Example User",
      email: "example@example.com",
      password: "password"
    })
  })

  if (!registerRes.ok) {
    const text = await registerRes.text()
    throw new Error(`Failed to register user: ${registerRes.status} ${text}`)
  }

  const registerData = await registerRes.json()
  const userId = registerData?.user?.id

  if (!userId) throw new Error("No user ID returned from sign-up response")

  // 2. Create 11 Habits
  const habitTitles = [
    "Morning Jog",
    "Meditation",
    "Read 10 pages",
    "No sugar",
    "Drink 2L water",
    "Sleep before 11PM",
    "Stretching",
    "Daily Planning",
    "No social media",
    "Practice gratitude",
    "Cold shower"
  ]

  const fixedCreationDate = "2024-06-29"
  const habitRows = habitTitles.map((title) => {
    return {
      id: nanoid(),
      title,
      description: `${title} daily`,
      priority: "medium",
      creation_date: fixedCreationDate,
      user_id: userId
    }
  })

  await db.insert(habits).values(habitRows)

  // 3. Create Entries per Day from 2024-06-29 until Today
  const entriesToInsert = []
  const startDate = parseISO("2024-06-29")
  const today = new Date()

  for (let day = startDate; isBefore(day, today); day = addDays(day, 1)) {
    const roll = Math.random()
    if (roll < 0.1) continue

    const habitsToday = habitRows.filter(() => Math.random() < 0.7)

    for (const habit of habitsToday) {
      const timestamp = `${format(day, "yyyy-MM-dd")}T${String(
        Math.floor(Math.random() * 24)
      ).padStart(2, "0")}:00:00`

      entriesToInsert.push({
        id: nanoid(),
        user_id: userId,
        habit_id: habit.id,
        completion_date: timestamp
      })
    }
  }

  await db.insert(entries).values(entriesToInsert)

  console.log(
    `✅ Seeded ${habitRows.length} habits and ${entriesToInsert.length} entries.`
  )
}

main().catch((err) => {
  console.error("❌ Seeding failed", err)
})
