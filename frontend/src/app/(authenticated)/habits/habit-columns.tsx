"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { EditHabitDialog } from "./edit-habit-dialog"
import { DeleteHabitDialog } from "./delete-habit-dialog"
import type { HabitWithCompletion } from "@/types"

interface ColumnsProps {
  onEditHabit: (
    id: string,
    data: { title: string; description?: string; priority?: string }
  ) => Promise<void>
  onDeleteHabit: (id: string) => Promise<void>
  onToggleCompletion: (
    habitId: string,
    isCompleted: boolean,
    entryId?: string
  ) => Promise<void>
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    case "medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "low":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

// Custom sorting function for priority
const prioritySortingFn = (rowA: any, rowB: any, columnId: string) => {
  const priorityOrder = {
    none: 1,
    low: 2,
    medium: 3,
    high: 4
  }

  const priorityA = rowA.getValue(columnId) as keyof typeof priorityOrder
  const priorityB = rowB.getValue(columnId) as keyof typeof priorityOrder

  const valueA = priorityOrder[priorityA] || 1
  const valueB = priorityOrder[priorityB] || 1

  return valueA - valueB
}

export const createHabitColumns = ({
  onEditHabit,
  onDeleteHabit,
  onToggleCompletion
}: ColumnsProps): ColumnDef<HabitWithCompletion>[] => [
  {
    id: "completion",
    header: "",
    cell: ({ row }) => {
      const habit = row.original
      return (
        <Checkbox
          checked={habit.isCompleted}
          onCheckedChange={(checked) =>
            onToggleCompletion(habit.id, !!checked, habit.entryId)
          }
          aria-label={`Mark ${habit.title} as ${habit.isCompleted ? "incomplete" : "complete"}`}
        />
      )
    },
    size: 40
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const habit = row.original
      return (
        <div className="space-y-1">
          <div
            className={
              habit.isCompleted ? "line-through text-muted-foreground" : ""
            }
          >
            {habit.title}
          </div>
          {habit.description && (
            <div className="text-sm text-muted-foreground">
              {habit.description}
            </div>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string
      return (
        <Badge variant="secondary" className={getPriorityColor(priority)}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
      )
    },
    sortingFn: prioritySortingFn,
    size: 100
  },
  {
    accessorKey: "creation_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("creation_date"))
      return date.toLocaleDateString()
    },
    size: 120
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const habit = row.original
      const [isEditOpen, setIsEditOpen] = React.useState(false)
      const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <EditHabitDialog
            habit={habit}
            isOpen={isEditOpen}
            onOpenChange={setIsEditOpen}
            onEditHabit={onEditHabit}
          />

          <DeleteHabitDialog
            habit={habit}
            isOpen={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onDeleteHabit={onDeleteHabit}
          />
        </>
      )
    },
    size: 50
  }
]
