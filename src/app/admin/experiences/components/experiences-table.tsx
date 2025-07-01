"use client"


import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, Edit3, Trash2 } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { ActionButton, StatusBadge } from "@/components/ui/data-table"
import { deleteExperience } from "@/lib/services/experiences"
import type { Experience } from "@/types/experiences"

interface ExperiencesTableProps {
  data: Experience[]
  loading?: boolean
  onRefresh?: () => void
}

export function ExperiencesTable({ data, loading, onRefresh }: ExperiencesTableProps) {
  const router = useRouter()

  const handleView = (experience: Experience) => {
    router.push(`/admin/experiences/${experience.id}`)
  }

  const handleEdit = (experience: Experience) => {
    router.push(`/admin/experiences/${experience.id}/edit`)
  }

  const handleDelete = async (experience: Experience) => {
    if (window.confirm(`Are you sure you want to delete "${experience.title}"?`)) {
      try {
        await deleteExperience(experience.id)
        onRefresh?.()
      } catch (error) {
        console.error('Failed to delete experience:', error)
      }
    }
  }

  const columns: ColumnDef<Experience>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ getValue }) => (
        <div className="font-medium max-w-xs truncate">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "vendor", 
      header: "Vendor",
      cell: ({ row }) => (
        <div className="text-gray-600">
          {row.original.vendor?.name || 'No vendor'}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string
        return (
          <StatusBadge status={status as any}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </StatusBadge>
        )
      },
    },
    {
      accessorKey: "starting_price",
      header: "Price",
      cell: ({ getValue }) => {
        const price = getValue() as number
        return (
          <div className="text-right font-mono">
            ${price?.toFixed(2) || '0.00'}
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
            tooltip="View"
            onClick={() => handleView(row.original)}
          />
          <ActionButton
            variant="edit"
            icon={<Edit3 className="w-4 h-4" />}
            tooltip="Edit"
            onClick={() => handleEdit(row.original)}
          />
          <ActionButton
            variant="delete"
            icon={<Trash2 className="w-4 h-4" />}
            tooltip="Delete"
            onClick={() => handleDelete(row.original)}
          />
        </div>
      ),
    },
  ]

  return (
    <DataTable<Experience, unknown>
      columns={columns}
      data={data}
      loading={loading}
      searchPlaceholder="Search experiences..."
      emptyMessage="No experiences found."
      filename="experiences"
    />
  )
} 