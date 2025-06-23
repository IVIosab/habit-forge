"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type SortingState,
  type PaginationState,
  useReactTable
} from "@tanstack/react-table"
import { useState, useMemo, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
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
  globalFilter: string
}

export function HabitDataTable({
  columns,
  data,
  onAddHabit,
  title,
  globalFilter
}: HabitDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  // Filter data based on global search
  const filteredData = useMemo(() => {
    if (!globalFilter) return data

    const searchTerm = globalFilter.toLowerCase()
    return data.filter((habit) => {
      return (
        habit.title.toLowerCase().includes(searchTerm) ||
        (habit.description &&
          habit.description.toLowerCase().includes(searchTerm)) ||
        habit.priority.toLowerCase().includes(searchTerm)
      )
    })
  }, [data, globalFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination
    }
  })

  // Reset to first page when filter changes
  useEffect(() => {
    table.setPageIndex(0)
  }, [globalFilter, table])

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">
          {filteredData.length} habit{filteredData.length !== 1 ? "s" : ""}
          {globalFilter && filteredData.length !== data.length && (
            <span className="ml-1">(filtered from {data.length})</span>
          )}
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
                    {globalFilter
                      ? "No habits match your search."
                      : "No habits found."}
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

      {/* Pagination Controls - Only show if there are results */}
      {filteredData.length > 0 && (
        <>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Pagination Info */}
          <div className="flex items-center justify-between px-2 text-sm text-muted-foreground">
            <div>
              Showing {table.getRowModel().rows.length} of {filteredData.length}{" "}
              habits
            </div>
            <div>
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              -{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                filteredData.length
              )}{" "}
              of {filteredData.length}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
