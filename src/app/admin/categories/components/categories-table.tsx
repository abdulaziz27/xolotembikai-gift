"use client"

import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, Edit3, Trash2, Tag, Hash } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { ActionButton, StatusBadge } from "@/components/ui/data-table"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  status: 'active' | 'inactive'
  total_experiences: number
  created_at: string
  updated_at: string
}

interface CategoriesTableProps {
  data: Category[]
  loading?: boolean
  onRefresh?: () => void
}

export function CategoriesTable({ data, loading, onRefresh }: CategoriesTableProps) {
  const router = useRouter()

  const handleView = (category: Category) => {
    router.push(`/admin/categories/${category.id}`)
  }

  const handleEdit = (category: Category) => {
    router.push(`/admin/categories/${category.id}/edit`)
  }

  const handleDelete = async (category: Category) => {
    if (category.total_experiences > 0) {
      alert(`Cannot delete category "${category.name}" because it has ${category.total_experiences} associated experiences.`)
      return
    }

    if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      try {
        const response = await fetch(`/api/categories/${category.id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          onRefresh?.()
        }
      } catch (error) {
        console.error('Failed to delete category:', error)
      }
    }
  }

  const handleBulkDelete = async (selectedCategories: Category[]) => {
    const categoriesWithExperiences = selectedCategories.filter(cat => cat.total_experiences > 0)
    
    if (categoriesWithExperiences.length > 0) {
      alert(`Cannot delete ${categoriesWithExperiences.length} categories because they have associated experiences.`)
      return
    }

    if (window.confirm(`Are you sure you want to delete ${selectedCategories.length} categories?`)) {
      try {
        await Promise.all(
          selectedCategories.map(category => 
            fetch(`/api/categories/${category.id}`, { method: 'DELETE' })
          )
        )
        onRefresh?.()
      } catch (error) {
        console.error('Failed to delete categories:', error)
      }
    }
  }

  const columns: ColumnDef<Category>[] = [
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
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <ActionButton
            variant="view"
            icon={<Eye className="w-4 h-4" />}
            tooltip="View Category"
            onClick={() => handleView(row.original)}
          />
          <ActionButton
            variant="edit"
            icon={<Edit3 className="w-4 h-4" />}
            tooltip="Edit Category"
            onClick={() => handleEdit(row.original)}
          />
          <ActionButton
            variant="delete"
            icon={<Trash2 className="w-4 h-4" />}
            tooltip={
              row.original.total_experiences > 0 
                ? `Cannot delete - ${row.original.total_experiences} experiences linked`
                : "Delete Category"
            }
            disabled={row.original.total_experiences > 0}
            onClick={() => handleDelete(row.original)}
          />
        </div>
      ),
    },
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
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      enableSorting={true}
      enableGlobalFilter={true}
      enableRowSelection={true}
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