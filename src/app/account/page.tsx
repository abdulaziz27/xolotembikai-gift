'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { Package, Heart, Settings, CreditCard, MapPin, Bell, Shield, User } from 'lucide-react'
import Link from 'next/link'

export default function AccountDashboard() {
  const { profile } = useAuth()

  const quickActions = [
    {
      title: 'My Orders',
      description: 'View and track your gift orders',
      href: '/account/orders',
      icon: Package,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Wishlist',
      description: 'Manage your saved experiences',
      href: '/account/wishlist',
      icon: Heart,
      color: 'bg-red-50 text-red-600'
    },
    {
      title: 'Profile Settings',
      description: 'Update your personal information',
      href: '/account/profile',
      icon: User,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Payment Methods',
      description: 'Manage your payment options',
      href: '/account/payment-methods',
      icon: CreditCard,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Addresses',
      description: 'Manage delivery addresses',
      href: '/account/addresses',
      icon: MapPin,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      title: 'Notifications',
      description: 'Manage your preferences',
      href: '/account/notifications',
      icon: Bell,
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      title: 'Security',
      description: 'Password and security settings',
      href: '/account/security',
      icon: Shield,
      color: 'bg-gray-50 text-gray-600'
    },
    {
      title: 'Account Settings',
      description: 'General account preferences',
      href: '/account/settings',
      icon: Settings,
      color: 'bg-indigo-50 text-indigo-600'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.full_name || 'User'}!
        </h1>
        <p className="text-purple-100">
          Manage your account and explore amazing gift experiences.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {quickActions.map((action) => {
          const IconComponent = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-300"
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-12 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No recent activity to show.</p>
          <p className="text-sm mt-1">Your orders and activities will appear here.</p>
        </div>
      </div>
    </div>
  )
} 