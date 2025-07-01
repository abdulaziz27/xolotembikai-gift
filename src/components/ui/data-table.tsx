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
  FilterFn,
  Table as TableInstance,
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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Filter,
  Search,
  Settings2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  EyeOff,
  X,
  Plus,
  Trash2,
  Edit3,
  Copy,
  FileDown,
  FileText,
} from "lucide-react"

import {
  cn,
  actionButtonVariants,
  statusBadgeVariants,
  defaultTableOptions,
  exportToCSV,
  exportToJSON,
  getAriaSort,
  getAriaLabel,
} from "@/lib/utils/table"

// Enhanced filtering function with fuzzy matching
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// Action button component
interface ActionButtonProps {
  onClick?: () => void
  variant?: keyof typeof actionButtonVariants
  icon: React.ReactNode
  tooltip?: string
  disabled?: boolean
  className?: string
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  variant = "secondary",
  icon,
  tooltip,
  disabled = false,
  className,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={tooltip}
    className={cn(
      "inline-flex items-center justify-center w-8 h-8 p-1 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
      actionButtonVariants[variant],
      className
    )}
  >
    {icon}
  </button>
)

// Status badge component
interface StatusBadgeProps {
  status: keyof typeof statusBadgeVariants
  children: React.ReactNode
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => (
  <span
    className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      statusBadgeVariants[status]
    )}
  >
    {children}
  </span>
)

// Loading skeleton component
const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, j) => (
          <div
            key={j}
            className="h-4 bg-gray-200 rounded animate-pulse flex-1"
          />
        ))}
      </div>
    ))}
  </div>
)

// Export dropdown
interface ExportDropdownProps<TData extends Record<string, unknown>> {
  data: TData[]
  filename?: string
}

const ExportDropdown = <TData extends Record<string, unknown>,>({
  data,
  filename = "export",
}: ExportDropdownProps<TData>) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="ml-auto"
      >
        <Download className="w-4 h-4 mr-2" />
        Export
        <ChevronDown className="w-4 h-4 ml-2" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-2 space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                exportToCSV(data, filename)
                setIsOpen(false)
              }}
              className="w-full justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export as CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                exportToJSON(data, filename)
                setIsOpen(false)
              }}
              className="w-full justify-start"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export as JSON
            </Button>
          </div>
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-full justify-start"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Main DataTable interface
export interface DataTableProps<TData extends Record<string, unknown>, TValue> {
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

// Column visibility dropdown
interface ColumnVisibilityDropdownProps<TData> {
  table: TableInstance<TData>
}

const ColumnVisibilityDropdown = <TData,>({
  table,
}: ColumnVisibilityDropdownProps<TData>) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="ml-auto"
      >
        <Settings2 className="w-4 h-4 mr-2" />
        Columns
        <ChevronDown className="w-4 h-4 ml-2" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-2 space-y-1">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <label
                  key={column.id}
                  className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <Checkbox
                    checked={column.getIsVisible()}
                    onChange={(e) => column.toggleVisibility(e.target.checked)}
                  />
                  <span className="text-sm capitalize">{column.id}</span>
                </label>
              ))}
          </div>
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-full justify-start"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Advanced filters component
interface AdvancedFiltersProps<TData> {
  table: TableInstance<TData>
}

const AdvancedFilters = <TData,>({
  table,
}: AdvancedFiltersProps<TData>) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="ml-auto"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filters
        <ChevronDown className="w-4 h-4 ml-2" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-2 space-y-1">
            {table.getAllColumns()
              .filter((column) => column.getCanFilter())
              .map((column) => (
                <div key={column.id} className="space-y-1">
                  <label className="text-sm font-medium">
                    {column.id}
                  </label>
                  <Input
                    value={(column.getFilterValue() as string) ?? ""}
                    onChange={(e) => column.setFilterValue(e.target.value)}
                    placeholder={`Filter ${column.id}...`}
                    className="h-8 w-full"
                  />
                </div>
              ))}
          </div>
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="w-full justify-start"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function DataTable<TData extends Record<string, unknown>, TValue>({
  columns,
  data,
  loading = false,
  pageSize = 10,
  enableSorting = true,
  enableFiltering = true,
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
  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter as FilterFn<TData>,
    },
    globalFilterFn: fuzzyFilter as FilterFn<TData>,
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

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (onBulkAction) {
      const selectedData = selectedRows.map(row => row.original)
      onBulkAction(action, selectedData)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        {enableGlobalFilter && (
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {enableRowSelection && hasSelectedRows && bulkActions.length > 0 && (
          <div className="flex items-center gap-2">
            {bulkActions.map((action) => (
              <Button
                key={action.value}
                variant={action.variant}
                size="sm"
                onClick={() => handleBulkAction(action.value)}
                className="flex items-center"
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {/* Tools */}
        <div className="flex items-center gap-2">
          {enableAdvancedFilters && <AdvancedFilters table={table} />}
          {enableColumnVisibility && <ColumnVisibilityDropdown table={table} />}
          {enableExport && <ExportDropdown data={data} filename={filename} />}
        </div>
      </div>

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
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className="h-8 w-[70px] rounded-md border border-input bg-transparent"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
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
    </div>
  )
}

// Export action components for reuse
export { ActionButton, StatusBadge, TableSkeleton } 