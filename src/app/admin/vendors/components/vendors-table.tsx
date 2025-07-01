"use client"

import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, Edit3, Trash2, MapPin, Mail, Phone } from "lucide-react"
import { ReactNode } from "react"

import { DataTable } from "@/components/ui/data-table"
import { ActionButton, StatusBadge } from "@/components/ui/data-table"
import type { Vendor } from "@/types"
import { statusBadgeVariants } from "@/lib/utils/table"

interface VendorsTableProps {
  data: Vendor[]
  loading?: boolean
  onRefresh?: () => void
}

type BulkAction = {
  label: string
  value: string
  icon?: ReactNode
  variant?: "default" | "destructive"
}

type VendorStatus = Vendor["status"]

export function VendorsTable({ data, loading, onRefresh }: VendorsTableProps) {
  const router = useRouter()

  const handleView = (vendor: Vendor) => {
    router.push(`/admin/vendors/${vendor.id}`)
  }

  const handleEdit = (vendor: Vendor) => {
    router.push(`/admin/vendors/${vendor.id}/edit`)
  }

  const handleDelete = async (vendor: Vendor) => {
    if (window.confirm(`Are you sure you want to delete vendor "${vendor.name}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/vendors/${vendor.id}`, {
          method: 'DELETE'
        })
        
        const data = await response.json()
        
        if (response.ok) {
          onRefresh?.()
          // Show success toast if available
          if (typeof window !== 'undefined' && 'addToast' in window) {
            (window as unknown as { addToast: (message: string, type: string) => void }).addToast('Vendor deleted successfully', 'success')
          }
        } else {
          throw new Error(data.error || 'Failed to delete vendor')
        }
      } catch (error) {
        console.error('Failed to delete vendor:', error)
        // Show error toast if available
        if (typeof window !== 'undefined' && 'addToast' in window) {
          (window as unknown as { addToast: (message: string, type: string) => void }).addToast(
            error instanceof Error ? error.message : 'Failed to delete vendor',
            'error'
          )
        } else {
          alert(error instanceof Error ? error.message : 'Failed to delete vendor')
        }
      }
    }
  }

  const handleBulkDelete = async (selectedVendors: Vendor[]) => {
    if (window.confirm(`Are you sure you want to delete ${selectedVendors.length} vendors? This action cannot be undone.`)) {
      try {
        const results = await Promise.allSettled(
          selectedVendors.map(vendor => 
            fetch(`/api/vendors/${vendor.id}`, { method: 'DELETE' })
          )
        )
        
        const failures = results.filter(result => result.status === 'rejected')
        
        if (failures.length === 0) {
          onRefresh?.()
          // Show success toast if available
          if (typeof window !== 'undefined' && 'addToast' in window) {
            (window as unknown as { addToast: (message: string, type: string) => void }).addToast(`${selectedVendors.length} vendors deleted successfully`, 'success')
          }
        } else {
          throw new Error(`Failed to delete ${failures.length} vendors`)
        }
      } catch (error) {
        console.error('Failed to delete vendors:', error)
        // Show error toast if available
        if (typeof window !== 'undefined' && 'addToast' in window) {
          (window as unknown as { addToast: (message: string, type: string) => void }).addToast(
            error instanceof Error ? error.message : 'Failed to delete some vendors',
            'error'
          )
        } else {
          alert(error instanceof Error ? error.message : 'Failed to delete some vendors')
        }
        onRefresh?.() // Refresh to show current state
      }
    }
  }

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: "name",
      header: "Vendor Name",
      cell: ({ getValue, row }) => {
        const value = getValue() as string
        return (
          <div>
            <div className="font-medium text-gray-900">
              {value}
            </div>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <Mail className="w-3 h-3 mr-1" />
              {row.original.email}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "phone",
      header: "Contact",
      cell: ({ getValue, row }) => {
        const value = getValue() as string | undefined
        return (
          <div className="text-sm text-gray-600">
            {value && (
              <div className="flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                {value}
              </div>
            )}
            {row.original.address && (
              <div className="flex items-center mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {row.original.address.split(',')[0] || 'Location'}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "total_experiences",
      header: "Experiences",
      cell: ({ getValue }) => {
        const value = getValue() as number | undefined
        return (
          <div className="text-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {value ?? 0} experiences
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const value = getValue() as VendorStatus
        const statusKey = value as keyof typeof statusBadgeVariants
        return (
          <StatusBadge status={statusKey}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </StatusBadge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ getValue }) => {
        const value = getValue() as string
        const date = new Date(value)
        return (
          <div className="text-sm text-gray-600">
            {date.toLocaleDateString()}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <ActionButton
            variant="view"
            icon={<Eye className="w-4 h-4" />}
            tooltip="View Details"
            onClick={() => handleView(row.original)}
          />
          <ActionButton
            variant="edit"
            icon={<Edit3 className="w-4 h-4" />}
            tooltip="Edit Vendor"
            onClick={() => handleEdit(row.original)}
          />
          <ActionButton
            variant="delete"
            icon={<Trash2 className="w-4 h-4" />}
            tooltip="Delete Vendor"
            onClick={() => handleDelete(row.original)}
          />
        </div>
      ),
    },
  ]

  const bulkActions: BulkAction[] = [
    {
      label: "Delete Selected",
      value: "delete",
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      variant: "destructive",
    },
  ]

  return (
    <DataTable<Vendor, string>
      columns={columns}
      data={data}
      loading={loading}
      enableSorting={true}
      enableGlobalFilter={true}
      enableRowSelection={true}
      enableExport={true}
      onBulkAction={(action, selectedData) => {
        if (action === "delete") {
          handleBulkDelete(selectedData)
        }
      }}
      bulkActions={bulkActions}
      searchPlaceholder="Search vendors..."
      emptyMessage="No vendors found. Add your first vendor to get started."
      filename="vendors"
      stickyHeader={true}
    />
  )
} 