"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, Edit3, Trash2 } from "lucide-react"
import { ReactNode } from "react"

import { DataTable } from "@/components/ui/data-table"
import { ActionButton } from "@/components/ui/data-table/action-button"
import { Button } from "@/components/ui/button"
import type { Vendor } from "@/types"
import { vendorService } from "@/lib/services/vendors"
import { useToast } from "@/components/ui/toast"

interface VendorsTableProps {
  data: Vendor[]
  loading: boolean
  onRefresh: () => void
}

type BulkAction = {
  label: string
  value: string
  icon?: ReactNode
  variant?: "default" | "destructive"
}

export default function VendorsTable({ data, loading, onRefresh }: VendorsTableProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [deleting, setDeleting] = useState(false)

  const handleView = (id: string) => {
    router.push(`/admin/vendors/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/vendors/${id}/edit`)
  }

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true)
      await vendorService.deleteVendor(id)
      addToast({ type: "success", title: "Vendor deleted successfully" })
      onRefresh()
    } catch (error) {
      console.error("Failed to delete vendor:", error)
      addToast({ type: "error", title: "Failed to delete vendor" })
    } finally {
      setDeleting(false)
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

  const columns: ColumnDef<Vendor, unknown>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.logo_url && (
            <img
              src={row.original.logo_url}
              alt={row.original.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span>{row.original.name}</span>
        </div>
      )
    },
    {
      accessorKey: "email",
      header: "Email"
    },
    {
      accessorKey: "phone",
      header: "Phone"
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              row.original.status === "active"
                ? "bg-green-100 text-green-800"
                : row.original.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.original.status}
          </span>
        </div>
      )
    },
    {
      accessorKey: "commission_rate",
      header: "Commission Rate",
      cell: ({ row }) => `${row.original.commission_rate}%`
    },
    {
      accessorKey: "api_integration_type",
      header: "Integration Type",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.api_integration_type}</span>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ActionButton
            icon={<Eye className="w-4 h-4" />}
            onClick={() => handleView(row.original.id)}
            tooltip="View"
            variant="view"
            disabled={deleting}
          />
          <ActionButton
            icon={<Edit3 className="w-4 h-4" />}
            onClick={() => handleEdit(row.original.id)}
            tooltip="Edit"
            variant="edit"
            disabled={deleting}
          />
          <ActionButton
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => handleDelete(row.original.id)}
            tooltip="Delete"
            variant="delete"
            disabled={deleting}
          />
        </div>
      )
    }
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
    <div>
      <div className="flex justify-between mb-4">
        <Button
          onClick={() => router.push("/admin/vendors/create")}
          className="ml-auto"
        >
          Add Vendor
        </Button>
      </div>
      <DataTable<Vendor, unknown>
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
    </div>
  )
} 