"use client"

import { DataTable } from "@/components/ui/data-table"
import { ActionButton, StatusBadge } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, Edit3, Trash2 } from "lucide-react"

interface TestData extends Record<string, unknown> {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  created_at: string
}

const testData: TestData[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    created_at: "2024-01-01"
  },
  {
    id: "2", 
    name: "Jane Smith",
    email: "jane@example.com",
    status: "inactive",
    created_at: "2024-01-02"
  },
  {
    id: "3",
    name: "Bob Johnson", 
    email: "bob@example.com",
    status: "pending",
    created_at: "2024-01-03"
  }
]

export default function TestTablePage() {
  const handleView = (row: TestData) => {
    alert(`Viewing: ${row.name}`)
  }

  const handleEdit = (row: TestData) => {
    alert(`Editing: ${row.name}`)
  }

  const handleDelete = (row: TestData) => {
    alert(`Deleting: ${row.name}`)
  }

  const columns: ColumnDef<TestData>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => (
        <div className="font-medium">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => (
        <div className="text-gray-600">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string
        return (
          <StatusBadge status={status as "active" | "inactive" | "pending"}>
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
        return <div>{date.toLocaleDateString()}</div>
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Table System Test</h1>
        <p className="text-gray-600 mt-1">
          Testing the new DataTable component with sample data
        </p>
      </div>

      <DataTable
        columns={columns}
        data={testData}
        searchPlaceholder="Search users..."
        emptyMessage="No users found."
        enableSorting={true}
        enableGlobalFilter={true}
        enableExport={true}
        filename="test-users"
      />
    </div>
  )
} 