"use client"

import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, Edit3, Shield, ShieldCheck, Mail, User as UserIcon, Calendar } from "lucide-react"

import { DataTable } from "@/components/ui/data-table"
import { ActionButton, StatusBadge } from "@/components/ui/data-table"
import type { User } from "@/types/users"

interface UsersTableProps {
  data: User[]
  loading?: boolean
  onRefresh?: () => void
}

export function UsersTable({ data, loading, onRefresh }: UsersTableProps) {
  const router = useRouter()

  const handleView = (user: User) => {
    router.push(`/admin/users/${user.id}`)
  }

  const handleEdit = (user: User) => {
    router.push(`/admin/users/${user.id}/edit`)
  }

  const handlePromoteToAdmin = async (user: User) => {
    if (window.confirm(`Promote "${user.full_name || user.email}" to admin?`)) {
      try {
        const response = await fetch(`/api/admin/promote-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, role: 'admin' })
        })
        if (response.ok) {
          onRefresh?.()
        }
      } catch (error) {
        console.error('Failed to promote user:', error)
      }
    }
  }

  const handleSuspendUser = async (user: User) => {
    const action = user.status === 'suspended' ? 'activate' : 'suspend'
    if (window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} user "${user.full_name || user.email}"?`)) {
      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            status: user.status === 'suspended' ? 'active' : 'suspended' 
          })
        })
        if (response.ok) {
          onRefresh?.()
        }
      } catch (error) {
        console.error('Failed to update user status:', error)
      }
    }
  }

  const getRoleVariant = (role: string) => {
    const roleMap: Record<string, "active" | "pending" | "inactive"> = {
      'admin': 'active',
      'vendor': 'pending',
      'user': 'inactive'
    }
    return roleMap[role] || 'inactive'
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "email",
      header: "User",
      cell: ({ getValue, row }) => (
        <div>
          <div className="font-medium text-gray-900 flex items-center">
            <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
            {row.original.full_name || getValue() as string}
          </div>
          {row.original.full_name && (
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <Mail className="w-3 h-3 mr-1" />
              {getValue() as string}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ getValue }) => {
        const role = getValue() as string
        return (
          <div className="flex items-center">
            {role === 'admin' ? (
              <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
            ) : (
              <Shield className="w-4 h-4 mr-2 text-gray-400" />
            )}
            <StatusBadge status={getRoleVariant(role)}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </StatusBadge>
          </div>
        )
      },
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
      accessorKey: "total_orders",
      header: "Orders",
      cell: ({ getValue }) => (
        <div className="text-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {(getValue() as number) || 0}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "last_sign_in",
      header: "Last Active",
      cell: ({ getValue }) => {
        const date = getValue() as string
        return (
          <div className="text-sm text-gray-600">
            {date ? new Date(date).toLocaleDateString() : 'Never'}
          </div>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string)
        return (
          <div className="text-sm text-gray-600 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
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
            tooltip="View User"
            onClick={() => handleView(row.original)}
          />
          <ActionButton
            variant="edit"
            icon={<Edit3 className="w-4 h-4" />}
            tooltip="Edit User"
            onClick={() => handleEdit(row.original)}
          />
          {row.original.role !== 'admin' && (
            <ActionButton
              variant="primary"
              icon={<ShieldCheck className="w-4 h-4" />}
              tooltip="Promote to Admin"
              onClick={() => handlePromoteToAdmin(row.original)}
            />
          )}
          <ActionButton
            variant={row.original.status === 'suspended' ? 'primary' : 'secondary'}
            icon={<Shield className="w-4 h-4" />}
            tooltip={row.original.status === 'suspended' ? 'Activate User' : 'Suspend User'}
            onClick={() => handleSuspendUser(row.original)}
          />
        </div>
      ),
    },
  ]

  const bulkActions = [
    {
      label: "Suspend Selected",
      value: "suspend",
      icon: <Shield className="w-4 h-4 mr-2" />,
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
        if (action === "suspend") {
          selectedData.forEach(user => handleSuspendUser(user as User))
        }
      }}
      bulkActions={bulkActions}
      searchPlaceholder="Search users..."
      emptyMessage="No users found. Users will appear here when they register."
      filename="users"
      stickyHeader={true}
    />
  )
} 