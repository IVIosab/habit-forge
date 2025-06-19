"use client"

import { useEffect, useState } from "react"
import { DataTable } from "./data-table"
import { columns, Habit } from "./columns"

export default function HabitTableClient() {
	const [habits, setHabits] = useState<Habit[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function fetchHabits() {
			try {
				const res = await fetch("http://localhost:3000/api/habits", {
					method: "GET",
					credentials: "include"
				})
				if (!res.ok) throw new Error("Failed to fetch habits.")
				const data = await res.json()
				setHabits(data)
			} catch (err: any) {
				setError(err.message || "Something went wrong.")
			} finally {
				setLoading(false)
			}
		}

		fetchHabits()
	}, [])

	if (loading) return <p className="text-muted">Loading...</p>
	if (error) return <p className="text-red-500">{error}</p>

	return <DataTable columns={columns} data={habits} />
}
