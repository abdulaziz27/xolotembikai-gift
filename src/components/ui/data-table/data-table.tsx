"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table"
import { rankItem } from "@tanstack/match-sorter-utils"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

import { cn, getAriaSort, getAriaLabel } from "@/lib/utils/table"
import { DataTableToolbar } from "./data-table-toolbar"
import { TableSkeleton } from "./table-skeleton"

// Enhanced filtering function with fuzzy matching
const fuzzyFilter = (row: { getValue: (id: string) => unknown }, columnId: string, value: string, addMeta: (meta: { itemRank: { passed: boolean } }) => void) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// Main DataTable interface
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  pageSize?: number
  enableSorting?: boolean
  enableFiltering?: boolean
  enableGlobalFilter?: boolean
  enableColumnVisibility?: boolean
  enableRowSelection?: boolean
  enableExport?: boolean
  enableAdvancedFilters?: boolean
  onRowSelectionChange?: (selection: RowSelectionState) => void
  onBulkAction?: (action: string, selectedRows: TData[]) => void
  bulkActions?: Array<{
    label: string
    value: string
    icon?: React.ReactNode
    variant?: "default" | "destructive"
  }>
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  size?: "sm" | "md" | "lg"
  stickyHeader?: boolean
  filename?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  pageSize = 10,
  enableSorting = true,
  enableGlobalFilter = true,
  enableColumnVisibility = true,
  enableRowSelection = false,
  enableExport = false,
  enableAdvancedFilters = false,
  onRowSelectionChange,
  onBulkAction,
  bulkActions = [],
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  className,
  size = "md",
  stickyHeader = false,
  filename = "export",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = React.useState<string>("")

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  // Handle external row selection changes
  React.useEffect(() => {
    if (onRowSelectionChange) {
      onRowSelectionChange(rowSelection)
    }
  }, [rowSelection, onRowSelectionChange])

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const hasSelectedRows = selectedRows.length > 0

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <DataTableToolbar
        table={table}
        enableGlobalFilter={enableGlobalFilter}
        enableColumnVisibility={enableColumnVisibility}
        enableExport={enableExport}
        enableAdvancedFilters={enableAdvancedFilters}
        enableRowSelection={enableRowSelection}
        onBulkAction={onBulkAction}
        bulkActions={bulkActions}
        searchPlaceholder={searchPlaceholder}
        filename={filename}
        data={data}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        selectedRows={selectedRows}
        hasSelectedRows={hasSelectedRows}
      />

      {/* Table */}
      <div className="rounded-md border">
        <div className={cn(
          "relative w-full overflow-auto",
          stickyHeader && "max-h-[600px]"
        )}>
          <Table>
            <TableHeader className={cn(stickyHeader && "sticky top-0 bg-white z-10")}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id}
                      className={cn(
                        enableSorting && header.column.getCanSort() && "cursor-pointer select-none",
                        size === "sm" && "px-3 py-2",
                        size === "lg" && "px-6 py-4"
                      )}
                      onClick={
                        enableSorting && header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      aria-sort={getAriaSort(header.column.getIsSorted())}
                      aria-label={getAriaLabel(header.id, header.column.getIsSorted())}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center space-x-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {enableSorting && header.column.getCanSort() && (
                            <div className="ml-2">
                              {header.column.getIsSorted() === "desc" ? (
                                <ArrowDown className="w-4 h-4" />
                              ) : header.column.getIsSorted() === "asc" ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowUpDown className="w-4 h-4 opacity-50" />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24">
                    <TableSkeleton rows={5} columns={columns.length} />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      row.getIsSelected() && "bg-muted/50",
                      size === "sm" && "[&_td]:py-2",
                      size === "lg" && "[&_td]:py-4"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        className={cn(
                          size === "sm" && "px-3 py-2",
                          size === "lg" && "px-6 py-4"
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          {hasSelectedRows && (
            <span className="mr-4">
              {selectedRows.length} of {table.getFilteredRowModel().rows.length} row(s) selected
            </span>
          )}
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className="h-8 w-[70px] rounded border border-input bg-background px-2 text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="w-4 h-4" />
              <span className="sr-only">Go to first page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="sr-only">Go to previous page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="w-4 h-4" />
              <span className="sr-only">Go to next page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="w-4 h-4" />
              <span className="sr-only">Go to last page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 