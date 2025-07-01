import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils"
import { FilterFn } from "@tanstack/react-table"

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Action button variants for consistent styling
export const actionButtonVariants = {
  view: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
  edit: "text-blue-600 hover:text-blue-900 hover:bg-blue-50",
  delete: "text-red-600 hover:text-red-900 hover:bg-red-50",
  primary: "text-purple-600 hover:text-purple-900 hover:bg-purple-50",
  secondary: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
}

// Status badge variants
export const statusBadgeVariants = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800", 
  draft: "bg-yellow-100 text-yellow-800",
  archived: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
  processing: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  success: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
} as const

// Column type definitions
export type ColumnType = 'text' | 'number' | 'date' | 'status' | 'image' | 'actions'

// Table size variants
export const tableSizeVariants = {
  sm: {
    cell: "px-3 py-2 text-xs",
    header: "px-3 py-2 text-xs font-medium",
    height: "h-8"
  },
  md: {
    cell: "px-4 py-3 text-sm", 
    header: "px-4 py-3 text-xs font-medium",
    height: "h-10"
  },
  lg: {
    cell: "px-6 py-4 text-sm",
    header: "px-6 py-3 text-xs font-medium", 
    height: "h-12"
  }
}

// Filter operators
export const filterOperators = [
  { value: 'contains', label: 'Contains' },
  { value: 'equals', label: 'Equals' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' },
  { value: 'isEmpty', label: 'Is empty' },
  { value: 'isNotEmpty', label: 'Is not empty' },
  { value: 'greaterThan', label: 'Greater than' },
  { value: 'lessThan', label: 'Less than' },
  { value: 'between', label: 'Between' },
]

// Default table options
export const defaultTableOptions = {
  pageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
  enableSorting: true,
  enableFiltering: true,
  enablePagination: true,
  enableRowSelection: true,
  enableColumnVisibility: true,
  enableGlobalFilter: true,
  enableExport: true,
  showRowNumbers: false,
  showSelectAll: true,
  stickyHeader: false,
}

// Accessibility helpers
export const getAriaSort = (isSorted: false | 'asc' | 'desc'): "none" | "ascending" | "descending" => {
  if (isSorted === 'asc') return 'ascending'
  if (isSorted === 'desc') return 'descending'
  return 'none'
}

export const getAriaLabel = (column: string, isSorted: false | 'asc' | 'desc'): string => {
  const sortDirection = isSorted === 'asc' ? 'ascending' : isSorted === 'desc' ? 'descending' : 'none'
  return `${column}, sort ${sortDirection}`
}

// Export utilities
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the ranking info
  addMeta(itemRank)

  // Return if the item should be filtered in/out
  return itemRank.passed
}

export const exportToCSV = <T extends Record<string, unknown>>(data: T[], filename: string) => {
  if (!data.length) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map(row => headers.map(header => {
      const value = row[header]
      if (value === null || value === undefined) return ""
      if (typeof value === "string") return `"${value.replace(/"/g, '""')}"`
      if (typeof value === "object") return `"${JSON.stringify(value).replace(/"/g, '""')}"`
      return value
    }).join(","))
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportToJSON = <T extends Record<string, unknown>>(data: T[], filename: string) => {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.json`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
} 