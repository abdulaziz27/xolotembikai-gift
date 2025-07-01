"use client"

import { useState, useEffect } from "react"
import { OrdersTable } from "./components/orders-table"

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  experience_title: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  order_date: string
  experience_date?: string
  participants: number
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (response.ok) {
        setOrders(data.orders || data || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage bookings and process orders
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total: {orders.length} orders
          </div>
        </div>
      </div>

      <OrdersTable 
        data={orders}
        loading={loading}
        onRefresh={fetchOrders}
      />
    </div>
  )
} 