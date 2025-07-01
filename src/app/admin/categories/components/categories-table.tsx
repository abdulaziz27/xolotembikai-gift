"use client"

import { useRouter } from "next/navigation"
import { ColumnDef, RowSelectionState } from "@tanstack/react-table"
import { Tag, Hash, Trash2 } from "lucide-react"
import { useState } from 'react'

import { DataTable } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/data-table"
import { Category } from '@/types'

interface CategoriesTableProps {
  data: Category[]
  loading?: boolean
  onRefresh?: () => void
  onDelete?: (id: string) => void
  onEdit?: (id: string) => void
}

export function CategoriesTable({
  data,
  loading = false,
  onDelete,
  onEdit
}: CategoriesTableProps) {
  const router = useRouter()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const handleView = (category: Category) => {
    router.push(`/admin/categories/${category.id}`)
  }

  const handleEdit = (category: Category) => {
    router.push(`/admin/categories/${category.id}/edit`)
  }

  const handleDelete = async (category: Category) => {
    if ((category.total_experiences ?? 0) > 0) {
      alert(`Cannot delete category "${category.name}" because it has ${category.total_experiences} associated experiences.`)
      return
    }

    if (onDelete) {
      onDelete(category.id)
    }
  }

  const handleBulkDelete = async (selectedData: Category[]) => {
    const categoriesWithExperiences = selectedData.filter(cat => (cat.total_experiences ?? 0) > 0)
    
    if (categoriesWithExperiences.length > 0) {
      alert(`Cannot delete ${categoriesWithExperiences.length} categories because they have associated experiences.`)
      return
    }

    if (onDelete) {
      selectedData.forEach(category => onDelete(category.id))
    }
  }

  const columns: ColumnDef<Category, unknown>[] = [
    {
      accessorKey: "name",
      header: "Category",
      cell: ({ getValue, row }) => (
        <div>
          <div className="font-medium text-gray-900 flex items-center">
            <Tag className="w-4 h-4 mr-2 text-gray-400" />
            {getValue() as string}
          </div>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <Hash className="w-3 h-3 mr-1" />
            {row.original.slug}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ getValue }) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {(getValue() as string) || "No description"}
        </div>
      ),
    },
    {
      accessorKey: "total_experiences",
      header: "Experiences",
      cell: ({ getValue }) => (
        <div className="text-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {getValue() as number}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string
        return (
          <StatusBadge status={status as "active" | "inactive"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </StatusBadge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string)
        return (
          <div className="text-sm text-gray-600">
            {date.toLocaleDateString()}
          </div>
        )
      },
    },
    {
      accessorKey: "updated_at",
      header: "Updated",
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string)
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
      cell: ({ row }) => {
        const category = row.original

        return (
          <div className="flex items-center gap-4">
            {onEdit && (
              <button
                onClick={() => onEdit(category.id)}
                className="text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => handleDelete(category)}
              className="text-red-600 hover:text-red-800"
              disabled={(category.total_experiences ?? 0) > 0}
            >
              Delete
            </button>
          </div>
        )
      }
    }
  ]

  const bulkActions = [
    {
      label: "Delete Selected",
      value: "delete",
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      variant: "destructive" as const,
    },
  ]

  return (
    <DataTable<Category, unknown>
      columns={columns}
      data={data}
      loading={loading}
      enableSorting={true}
      enableFiltering={true}
      enableRowSelection={true}
      onRowSelectionChange={setRowSelection}
      enableExport={true}
      onBulkAction={(action, selectedData) => {
        if (action === "delete") {
          handleBulkDelete(selectedData as Category[])
        }
      }}
      bulkActions={bulkActions}
      searchPlaceholder="Search categories..."
      emptyMessage="No categories found. Create your first category to organize experiences."
      filename="categories"
      stickyHeader={true}
    />
  )
} 