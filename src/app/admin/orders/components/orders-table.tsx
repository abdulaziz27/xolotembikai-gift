"use client";

import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit3, Package, CreditCard, User, Calendar } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { ActionButton, StatusBadge } from "@/components/ui/data-table";
import type { SimpleOrder } from "@/types/orders";

interface OrdersTableProps {
  data: SimpleOrder[];
  loading?: boolean;
  onRefresh?: () => void;
}

export function OrdersTable({ data, loading, onRefresh }: OrdersTableProps) {
  const router = useRouter();

  const handleView = (order: SimpleOrder) => {
    router.push(`/admin/orders/${order.id}`);
  };

  const handleEdit = (order: SimpleOrder) => {
    router.push(`/admin/orders/${order.id}/edit`);
  };

  const handleFulfill = async (order: SimpleOrder) => {
    if (window.confirm(`Mark order "${order.order_number}" as fulfilled?`)) {
      try {
        const response = await fetch(`/api/orders/${order.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        });
        if (response.ok) {
          onRefresh?.();
        }
      } catch (error) {
        console.error("Failed to fulfill order:", error);
      }
    }
  };

  const handleRefund = async (order: SimpleOrder) => {
    if (window.confirm(`Process refund for order "${order.order_number}"?`)) {
      try {
        const response = await fetch(`/api/orders/${order.id}/refund`, {
          method: "POST",
        });
        if (response.ok) {
          onRefresh?.();
        }
      } catch (error) {
        console.error("Failed to process refund:", error);
      }
    }
  };

  const getStatusVariant = (status: string) => {
    const statusMap: Record<
      string,
      "pending" | "completed" | "cancelled" | "processing"
    > = {
      pending: "pending",
      confirmed: "processing",
      completed: "completed",
      cancelled: "cancelled",
      refunded: "cancelled",
    };
    return statusMap[status] || "pending";
  };

  const getPaymentStatusVariant = (status: string) => {
    const statusMap: Record<string, "pending" | "completed" | "failed"> = {
      pending: "pending",
      paid: "completed",
      failed: "failed",
      refunded: "failed",
    };
    return statusMap[status] || "pending";
  };

  const columns: ColumnDef<SimpleOrder>[] = [
    {
      accessorKey: "order_number",
      header: "Order",
      cell: ({ getValue, row }) => (
        <div>
          <div className="font-medium text-gray-900">
            #{getValue() as string}
          </div>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(row.original.order_date).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ getValue, row }) => (
        <div>
          <div className="font-medium text-gray-900 flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            {getValue() as string}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {row.original.customer_email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "experience_title",
      header: "Experience",
      cell: ({ getValue, row }) => (
        <div>
          <div className="font-medium text-gray-900 max-w-xs truncate">
            {getValue() as string}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {row.original.participants} participant
            {row.original.participants !== 1 ? "s" : ""}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "Amount",
      cell: ({ getValue }) => (
        <div className="text-right font-mono font-medium">
          ${(getValue() as number).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Order Status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return (
          <StatusBadge status={getStatusVariant(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </StatusBadge>
        );
      },
    },
    {
      accessorKey: "payment_status",
      header: "Payment",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return (
          <div className="flex items-center">
            <CreditCard className="w-3 h-3 mr-1 text-gray-400" />
            <StatusBadge status={getPaymentStatusVariant(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </StatusBadge>
          </div>
        );
      },
    },
    {
      accessorKey: "experience_date",
      header: "Exp. Date",
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return (
          <div className="text-sm text-gray-600">
            {date ? new Date(date).toLocaleDateString() : "TBD"}
          </div>
        );
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
            tooltip="View Order"
            onClick={() => handleView(row.original)}
          />
          <ActionButton
            variant="edit"
            icon={<Edit3 className="w-4 h-4" />}
            tooltip="Edit Order"
            onClick={() => handleEdit(row.original)}
          />
          {(row.original.status === "pending" ||
            row.original.status === "confirmed") && (
            <ActionButton
              variant="primary"
              icon={<Package className="w-4 h-4" />}
              tooltip="Mark as Fulfilled"
              onClick={() => handleFulfill(row.original)}
            />
          )}
          {row.original.payment_status === "paid" &&
            row.original.status !== "refunded" && (
              <ActionButton
                variant="secondary"
                icon={<CreditCard className="w-4 h-4" />}
                tooltip="Process Refund"
                onClick={() => handleRefund(row.original)}
              />
            )}
        </div>
      ),
    },
  ];

  const bulkActions = [
    {
      label: "Mark as Fulfilled",
      value: "fulfill",
      icon: <Package className="w-4 h-4 mr-2" />,
      variant: "default" as const,
    },
    {
      label: "Export Orders",
      value: "export",
      icon: <Package className="w-4 h-4 mr-2" />,
      variant: "default" as const,
    },
  ];

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
        if (action === "fulfill") {
          selectedData.forEach((order) => handleFulfill(order as SimpleOrder));
        }
      }}
      bulkActions={bulkActions}
      searchPlaceholder="Search orders..."
      emptyMessage="No orders found. Orders will appear here when customers make bookings."
      filename="orders"
      stickyHeader={true}
      pageSize={20}
    />
  );
}
