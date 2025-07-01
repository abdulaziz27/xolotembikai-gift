'use client'

import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  Package,
  Store,
  Gift,
  AlertCircle
} from 'lucide-react'

export default function AdminDashboard() {
  // Mock data - replace with real data from API
  const stats = [
    {
      name: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      changeType: 'increase',
      icon: DollarSign,
    },
    {
      name: 'Total Orders',
      value: '2,350',
      change: '+180.1%',
      changeType: 'increase',
      icon: ShoppingBag,
    },
    {
      name: 'Active Users',
      value: '12,234',
      change: '+19%',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Active Vendors',
      value: '573',
      change: '+201',
      changeType: 'increase',
      icon: Store,
    },
  ]

  const recentOrders = [
    { id: '001', customer: 'John Doe', amount: '$299.00', status: 'completed' },
    { id: '002', customer: 'Jane Smith', amount: '$199.00', status: 'pending' },
    { id: '003', customer: 'Bob Johnson', amount: '$399.00', status: 'processing' },
    { id: '004', customer: 'Alice Brown', amount: '$149.00', status: 'completed' },
    { id: '005', customer: 'Charlie Wilson', amount: '$249.00', status: 'cancelled' },
  ]

  const quickActions = [
    { name: 'Add Experience', href: '/admin/experiences', icon: Gift, color: 'bg-purple-500' },
    { name: 'Manage Orders', href: '/admin/orders', icon: ShoppingBag, color: 'bg-blue-500' },
    { name: 'Add Vendor', href: '/admin/vendors', icon: Store, color: 'bg-green-500' },
    { name: 'View Users', href: '/admin/users', icon: Users, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className={`font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-gray-500"> from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickActions.map((action) => (
              <a
                key={action.name}
                href={action.href}
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div>
                  <span className={`rounded-lg inline-flex p-3 ${action.color} text-white`}>
                    <action.icon className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    <span className="absolute inset-0" />
                    {action.name}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders and Alerts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Orders</h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <li key={order.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Order #{order.id}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {order.customer}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {order.amount}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <a
                href="/admin/orders"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View all orders
              </a>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">System Alerts</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Low inventory alert</p>
                  <p className="text-xs text-gray-500">3 experiences are running low on availability</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">New vendor application</p>
                  <p className="text-xs text-gray-500">2 vendors are waiting for approval</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">System update completed</p>
                  <p className="text-xs text-gray-500">All systems are running smoothly</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 