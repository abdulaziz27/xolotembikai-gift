import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface DataTableToolbarProps<TData = unknown> {
  table: unknown
  enableGlobalFilter: boolean
  enableColumnVisibility: boolean
  enableExport: boolean
  enableAdvancedFilters: boolean
  enableRowSelection: boolean
  onBulkAction?: (action: string, selectedRows: TData[]) => void
  bulkActions: Array<{
    label: string
    value: string
    icon?: React.ReactNode
    variant?: "default" | "destructive"
  }>
  searchPlaceholder: string
  filename: string
  data: TData[]
  globalFilter: string
  setGlobalFilter: (value: string) => void
  selectedRows: Array<{ original: TData }>
  hasSelectedRows: boolean
}

export const DataTableToolbar = <TData,>({
  enableGlobalFilter,
  enableRowSelection,
  onBulkAction,
  bulkActions,
  searchPlaceholder,
  globalFilter,
  setGlobalFilter,
  selectedRows,
  hasSelectedRows,
}: DataTableToolbarProps<TData>) => {
  const handleBulkAction = (action: string) => {
    if (onBulkAction && hasSelectedRows) {
      const selectedData = selectedRows.map((row) => row.original)
      onBulkAction(action, selectedData)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-1 flex-col sm:flex-row gap-2 items-start sm:items-center">
        {enableGlobalFilter && (
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {enableRowSelection && hasSelectedRows && bulkActions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedRows.length} selected
            </span>
            {bulkActions.map((action) => (
              <Button
                key={action.value}
                variant={action.variant === "destructive" ? "destructive" : "outline"}
                size="sm"
                onClick={() => handleBulkAction(action.value)}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 