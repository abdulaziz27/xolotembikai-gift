import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { ActionButton } from "@/components/ui/data-table/action-button"
import { StatusBadge } from "@/components/ui/data-table/status-badge"
import { Eye, Edit3, Trash2, MoreHorizontal } from "lucide-react"
import { cn, statusBadgeVariants } from "@/lib/utils/table"

// Selection column helper
export const createSelectionColumn = <TData,>(): ColumnDef<TData> => ({
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      indeterminate={table.getIsSomePageRowsSelected()}
      onChange={(event) => table.toggleAllPageRowsSelected(!!event.target.checked)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onChange={(event) => row.toggleSelected(!!event.target.checked)}
      aria-label={`Select row ${row.index + 1}`}
    />
  ),
  enableSorting: false,
  enableHiding: false,
})

// Text column helper
export const createTextColumn = <TData,>(
  accessorKey: string,
  header: string,
  options?: {
    className?: string
    sortable?: boolean
    filterable?: boolean
    width?: number
  }
): ColumnDef<TData> => ({
  accessorKey,
  header,
  enableSorting: options?.sortable ?? true,
  enableColumnFilter: options?.filterable ?? true,
  size: options?.width,
  cell: ({ getValue }) => (
    <div className={cn("truncate", options?.className)}>
      {getValue() as string}
    </div>
  ),
})

// Status column helper
export const createStatusColumn = <TData,>(
  accessorKey: string,
  header: string = "Status",
  statusMap?: Record<string, keyof typeof statusBadgeVariants>
): ColumnDef<TData> => ({
  accessorKey,
  header,
  cell: ({ getValue }) => {
    const status = getValue() as string
    const mappedStatus = statusMap?.[status] || (status as keyof typeof statusBadgeVariants)
    
    return (
      <StatusBadge status={mappedStatus}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </StatusBadge>
    )
  },
  enableColumnFilter: true,
  filterFn: (row, id, value) => {
    return value.includes(row.getValue(id))
  },
})

// Date column helper
export const createDateColumn = <TData,>(
  accessorKey: string,
  header: string,
  options?: {
    format?: 'short' | 'long' | 'relative'
    className?: string
  }
): ColumnDef<TData> => ({
  accessorKey,
  header,
  cell: ({ getValue }) => {
    const date = getValue() as string | Date
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    let formattedDate = ""
    switch (options?.format || 'short') {
      case 'short':
        formattedDate = dateObj.toLocaleDateString()
        break
      case 'long':
        formattedDate = dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        break
      case 'relative':
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - dateObj.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) formattedDate = "Today"
        else if (diffDays === 1) formattedDate = "Yesterday"
        else if (diffDays < 7) formattedDate = `${diffDays} days ago`
        else formattedDate = dateObj.toLocaleDateString()
        break
    }
    
    return (
      <div className={cn("text-sm", options?.className)}>
        {formattedDate}
      </div>
    )
  },
  enableSorting: true,
  sortingFn: (rowA, rowB, columnId) => {
    const dateA = new Date(rowA.getValue(columnId) as string)
    const dateB = new Date(rowB.getValue(columnId) as string)
    return dateA.getTime() - dateB.getTime()
  },
})

// Number column helper
export const createNumberColumn = <TData,>(
  accessorKey: string,
  header: string,
  options?: {
    format?: 'currency' | 'percentage' | 'decimal'
    currency?: string
    decimals?: number
    className?: string
  }
): ColumnDef<TData> => ({
  accessorKey,
  header,
  cell: ({ getValue }) => {
    const value = getValue() as number
    let formatted = ""
    
    switch (options?.format || 'decimal') {
      case 'currency':
        formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: options?.currency || 'USD',
          minimumFractionDigits: options?.decimals ?? 2,
        }).format(value)
        break
      case 'percentage':
        formatted = new Intl.NumberFormat('en-US', {
          style: 'percent',
          minimumFractionDigits: options?.decimals ?? 1,
        }).format(value / 100)
        break
      default:
        formatted = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: options?.decimals ?? 0,
          maximumFractionDigits: options?.decimals ?? 2,
        }).format(value)
    }
    
    return (
      <div className={cn("text-right font-mono", options?.className)}>
        {formatted}
      </div>
    )
  },
  enableSorting: true,
  meta: {
    align: 'right',
  },
})

// Actions column helper
export const createActionsColumn = <TData,>(
  actions: Array<{
    label: string
    icon: React.ReactNode
    onClick: (row: TData) => void
    variant?: 'view' | 'edit' | 'delete' | 'primary' | 'secondary'
    show?: (row: TData) => boolean
  }>
): ColumnDef<TData> => ({
  id: "actions",
  header: "Actions",
  cell: ({ row }) => (
    <div className="flex items-center gap-1">
      {actions
        .filter(action => !action.show || action.show(row.original))
        .map((action, index) => (
          <ActionButton
            key={index}
            variant={action.variant || 'secondary'}
            icon={action.icon}
            tooltip={action.label}
            onClick={() => action.onClick(row.original)}
            aria-label={action.label}
          />
        ))}
    </div>
  ),
  enableSorting: false,
  enableHiding: false,
  size: 120,
})

// Common action presets
export const commonActions = {
  view: <T,>(onView: (row: T) => void) => ({
    label: "View",
    icon: <Eye className="w-4 h-4" />,
    onClick: onView,
    variant: 'view' as const,
  }),
  edit: <T,>(onEdit: (row: T) => void) => ({
    label: "Edit", 
    icon: <Edit3 className="w-4 h-4" />,
    onClick: onEdit,
    variant: 'edit' as const,
  }),
  delete: <T,>(onDelete: (row: T) => void) => ({
    label: "Delete",
    icon: <Trash2 className="w-4 h-4" />,
    onClick: onDelete,
    variant: 'delete' as const,
  }),
  menu: <T,>(onMenu: (row: T) => void) => ({
    label: "More options",
    icon: <MoreHorizontal className="w-4 h-4" />,
    onClick: onMenu,
    variant: 'secondary' as const,
  }),
}

// Image column helper
export const createImageColumn = <TData,>(
  accessorKey: string,
  header: string,
  options?: {
    size?: 'sm' | 'md' | 'lg'
    fallback?: string
    className?: string
  }
): ColumnDef<TData> => ({
  accessorKey,
  header,
  cell: ({ getValue }) => {
    const src = getValue() as string
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-12 h-12", 
      lg: "w-16 h-16"
    }
    
    return (
      <div className={cn("flex items-center", options?.className)}>
        <img
          src={src || options?.fallback || "/placeholder-image.png"}
          alt=""
          className={cn(
            "rounded-md object-cover",
            sizeClasses[options?.size || 'md']
          )}
          onError={(e) => {
            if (options?.fallback) {
              (e.target as HTMLImageElement).src = options.fallback
            }
          }}
        />
      </div>
    )
  },
  enableSorting: false,
  size: 80,
}) 