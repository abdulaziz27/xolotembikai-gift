'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  User, 
  Gift, 
  Heart, 
  CreditCard, 
  MapPin, 
  Bell, 
  Shield, 
  LogOut, 
  Eye,
  DollarSign,
  Package,
  Edit2,
  Plus,
  Download,
  Trash2,
  X,
  Home
} from 'lucide-react'
import ChangePasswordForm from '@/components/auth/change-password-form'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type TabType = 
  | 'dashboard' 
  | 'orders' 
  | 'wishlist' 
  | 'profile' 
  | 'payment-methods' 
  | 'addresses' 
  | 'notifications' 
  | 'security'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [showChangePassword, setShowChangePassword] = useState(false)

  const supabase = createClient()

  // Handle authentication redirect
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const setupSuccess = searchParams.get('setup') === 'success'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: User, description: 'Overview & stats' },
    { id: 'orders', label: 'Orders', icon: Package, description: 'Track your gift orders' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, description: 'Saved for later' },
    { id: 'profile', label: 'Profile', icon: User, description: 'Personal information' },
    { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard, description: 'Manage cards' },
    { id: 'addresses', label: 'Addresses', icon: MapPin, description: 'Delivery addresses' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Preferences' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Account security' },
  ]

  const getUserInitial = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.charAt(0).toUpperCase()
    }
    return user.email?.charAt(0).toUpperCase() || 'U'
  }

  const renderDashboardOverview = () => (
    <div className="space-y-6">
      {/* Success Messages */}
      {setupSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Gift className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Welcome! Your account has been set up successfully.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-gray-600 mt-1">Here's your account overview and recent activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-red-500">$2,847</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Wishlist Items</p>
              <p className="text-2xl font-bold text-purple-600">2</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Deliveries</p>
              <p className="text-2xl font-bold text-yellow-600">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <button 
            onClick={() => setActiveTab('orders')}
            className="text-purple-600 hover:text-purple-800 font-medium text-sm bg-purple-50 px-4 py-2 rounded-lg"
          >
            View All
          </button>
        </div>
        <p className="text-gray-600 mb-6">Your latest gift orders</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Luxury Spa Package</h3>
                <p className="text-sm text-gray-600">To: Sarah Johnson</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">$299</p>
              <p className="text-xs text-gray-500">6/10/2024</p>
              <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                delivered
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Wine Tasting Experience</h3>
                <p className="text-sm text-gray-600">To: Mike Chen</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">$189</p>
              <p className="text-xs text-gray-500">5/15/2024</p>
              <span className="inline-block mt-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                pending
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderOrders = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        <p className="text-gray-600 mt-1">Track and manage your gift orders</p>
      </div>

      <div className="space-y-4">
        {[
          {
            id: 1,
            name: 'Luxury Spa Package',
            recipient: 'Sarah Johnson',
            occasion: 'Birthday',
            price: '$299',
            delivery: '6/10/2024',
            status: 'delivered',
            redeemed: 'Yes'
          },
          {
            id: 2,
            name: 'Wine Tasting Experience',
            recipient: 'Mike Chen',
            occasion: 'Anniversary',
            price: '$189',
            delivery: '5/15/2024',
            status: 'pending',
            redeemed: 'No'
          },
          {
            id: 3,
            name: 'Art Workshop Experience',
            recipient: 'Emily Davis',
            occasion: 'Graduation',
            price: '$149',
            delivery: '6/15/2024',
            status: 'processing',
            redeemed: 'No'
          }
        ].map((order) => (
          <div key={order.id} className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{order.name}</h3>
                  <p className="text-sm text-gray-600">Recipient: {order.recipient}</p>
                  <p className="text-sm text-gray-600">Occasion: {order.occasion}</p>
                </div>
              </div>
              <div className="text-right space-y-2">
                <p className="font-bold text-gray-900">{order.price}</p>
                <p className="text-sm text-gray-600">Delivery: {order.delivery}</p>
                <p className="text-sm text-gray-600">Redeemed: {order.redeemed}</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {order.status}
                </span>
                <button className="ml-2 p-1 text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-8">
        <button className="text-purple-600 hover:text-purple-800 font-medium bg-purple-50 px-6 py-3 rounded-lg">
          Load More Orders
        </button>
      </div>
    </div>
  )

  const renderWishlist = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-1">Items you've saved for later</p>
        </div>
        <button className="text-red-500 hover:text-red-700 font-medium">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            name: 'Luxury Spa Package',
            description: 'A relaxing spa experience with massage, facial, and wellness treatments',
            price: '$299'
          },
          {
            name: 'Wine Tasting Experience',
            description: 'Private wine tasting session with expert sommelier and premium selections',
            price: '$189'
          }
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <Gift className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-600">{item.price}</span>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
        <p className="text-gray-600 mt-1">Update your personal details and preferences</p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              defaultValue={user.user_metadata?.full_name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue={user.email || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-orange-600">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )

  const renderPaymentMethods = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
        <p className="text-gray-600 mt-1">Manage your saved payment methods</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">•••• •••• •••• 1234</p>
              <p className="text-sm text-gray-600">Expires 12/25</p>
            </div>
          </div>
          <button className="p-2 text-purple-600 hover:text-purple-800">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <button className="w-full bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors">
          <Plus className="w-5 h-5 mx-auto mb-2" />
          Add New Payment Method
        </button>
      </div>
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notification Preferences</h1>
        <p className="text-gray-600 mt-1">Choose how you'd like to be notified</p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border space-y-6">
        {[
          {
            title: 'Email Notifications',
            description: 'Receive order updates via email',
            enabled: true
          },
          {
            title: 'SMS Notifications',
            description: 'Receive notifications via text',
            enabled: false
          },
          {
            title: 'Delivery Updates',
            description: 'Get notified about gift deliveries',
            enabled: true
          },
          {
            title: 'Marketing Emails',
            description: 'Receive promotional offers',
            enabled: false
          }
        ].map((notification, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{notification.title}</h3>
              <p className="text-sm text-gray-600">{notification.description}</p>
            </div>
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              notification.enabled ? 'bg-purple-600' : 'bg-gray-200'
            }`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                notification.enabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Security</h1>
        <p className="text-gray-600 mt-1">Manage your account security settings</p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Password</h3>
            <p className="text-sm text-gray-600">Last updated 30 days ago</p>
          </div>
          <button
            onClick={() => setShowChangePassword(true)}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Change Password
          </button>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <button className="text-purple-600 hover:text-purple-800 font-medium">
              Enable
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Download Account Data</h3>
              <p className="text-sm text-gray-600">Get a copy of your account data</p>
            </div>
            <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-medium">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-red-600">Delete Account</h3>
              <p className="text-sm text-gray-600">Permanently delete your account</p>
            </div>
            <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              <Trash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardOverview()
      case 'orders':
        return renderOrders()
      case 'wishlist':
        return renderWishlist()
      case 'profile':
        return renderProfile()
      case 'payment-methods':
        return renderPaymentMethods()
      case 'notifications':
        return renderNotifications()
      case 'security':
        return renderSecurity()
      default:
        return renderDashboardOverview()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 bg-white rounded-lg shadow-sm border p-6">
            {/* User Profile */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{getUserInitial()}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {/* Back to Home */}
              <Link 
                href="/"
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-50"
              >
                <Home className="w-5 h-5" />
                <div>
                  <p className="font-medium">Back to Home</p>
                  <p className="text-xs text-gray-500">Return to main site</p>
                </div>
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabType)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id 
                        ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </button>
                )
              })}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <div>
                  <p className="font-medium">Logout</p>
                  <p className="text-xs text-red-400">Sign out of your account</p>
                </div>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
              <button
                onClick={() => setShowChangePassword(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <ChangePasswordForm 
              onSuccess={() => setShowChangePassword(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
} 