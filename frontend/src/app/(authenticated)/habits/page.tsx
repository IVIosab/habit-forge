import { columns, Habit } from "./columns"
import { DataTable } from "./data-table"
import HabitTableClient from "./HabitTableClient"

async function getData(): Promise<Habit[]> {
	// Fetch data from your API here.
	return [
		{
			id: "728ed52f",
			user_id: "123",
			name: "Sleep"
		},
		{
			id: "a913be21",
			user_id: "123",
			name: "Exercise"
		},
		{
			id: "c8f2d45e",
			user_id: "123",
			name: "Read for 30 minutes"
		},
		{
			id: "9f16c3d2",
			user_id: "123",
			name: "Drink 2L of water"
		},
		{
			id: "4b0a8d89",
			user_id: "123",
			name: "Meditate"
		},
		{
			id: "d3700e1c",
			user_id: "123",
			name: "No sugar"
		},
		{
			id: "f582dc7a",
			user_id: "123",
			name: "Practice coding"
		},
		{
			id: "1a7e3b0c",
			user_id: "123",
			name: "Clean room"
		},
		{
			id: "e394bc8f",
			user_id: "123",
			name: "Limit social media"
		},
		{
			id: "b56f9021",
			user_id: "123",
			name: "Journal"
		},
		{
			id: "3c9ad847",
			user_id: "123",
			name: "Plan tomorrow"
		},
		{
			id: "fe6d4210",
			user_id: "123",
			name: "Take vitamins"
		}
	]
}

export default async function DemoPage() {
	const data = await getData()

	return <HabitTableClient />
}
