"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable
} from "@tanstack/react-table"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { AddHabitDialog } from "./add-habit-dialog"
import type { HabitWithCompletion } from "@/types"

interface HabitDataTableProps {
  columns: ColumnDef<HabitWithCompletion, any>[]
  data: HabitWithCompletion[]
  onAddHabit?: (data: {
    title: string
    description?: string
    priority?: string
  }) => Promise<void>
  title: string
}

export function HabitDataTable({
  columns,
  data,
  onAddHabit,
  title
}: HabitDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting
    }
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">
          {data.length} habit{data.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {onAddHabit && (
                  <TableRow className="hover:bg-muted/50">
                    <TableCell colSpan={columns.length}>
                      <AddHabitDialog onAddHabit={onAddHabit} />
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No habits found.
                  </TableCell>
                </TableRow>
                {onAddHabit && (
                  <TableRow className="hover:bg-muted/50">
                    <TableCell colSpan={columns.length}>
                      <AddHabitDialog onAddHabit={onAddHabit} />
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
