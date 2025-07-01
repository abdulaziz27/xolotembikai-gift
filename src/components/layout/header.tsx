'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Menu, X, User, ChevronDown } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'

const navigationItems = [
  { name: 'Experiences', href: '/experiences' },
  { name: 'About Us', href: '/about' },
  { name: 'Become A Partner', href: '/partner' },
  { name: 'Blog', href: '/blog' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
]

function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center md:space-x-8">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`text-sm font-medium transition-colors hover:text-purple-400 ${
              pathname === item.href ? 'text-purple-400' : 'text-white'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex md:items-center md:space-x-4">
        <Link
          href="/login"
          className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-orange-600 transition-all transform hover:scale-105"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white hover:text-purple-400 transition-colors"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800 md:hidden">
          <div className="px-4 py-6 space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block text-base font-medium transition-colors hover:text-purple-400 ${
                  pathname === item.href ? 'text-purple-400' : 'text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-800 pt-4 space-y-4">
              <Link
                href="/login"
                className="block text-base font-medium text-white hover:text-purple-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="block bg-gradient-to-r from-purple-600 to-orange-500 text-white px-4 py-2 rounded-lg text-base font-medium hover:from-purple-700 hover:to-orange-600 transition-all text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function AuthenticatedHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()
  const { profile, signOut, isAdmin } = useAuth()

  const dashboardLink = isAdmin ? '/admin' : '/account'
  const dashboardText = isAdmin ? 'Admin Panel' : 'My Account'

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center md:space-x-8">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`text-sm font-medium transition-colors hover:text-purple-400 ${
              pathname === item.href ? 'text-purple-400' : 'text-white'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Desktop User Menu */}
      <div className="hidden md:flex md:items-center md:space-x-4">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 text-sm font-medium text-white hover:text-purple-400 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span>{profile?.full_name || 'User'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
              <Link
                href={dashboardLink}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                {dashboardText}
              </Link>
              {!isAdmin && (
                <Link
                  href="/account/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Orders
                </Link>
              )}
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  signOut()
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white hover:text-purple-400 transition-colors"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800 md:hidden">
          <div className="px-4 py-6 space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block text-base font-medium transition-colors hover:text-purple-400 ${
                  pathname === item.href ? 'text-purple-400' : 'text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-800 pt-4 space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-medium text-white">
                  {profile?.full_name || 'User'}
                </span>
              </div>
              <Link
                href={dashboardLink}
                className="block text-base font-medium text-white hover:text-purple-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {dashboardText}
              </Link>
              {!isAdmin && (
                <Link
                  href="/account/orders"
                  className="block text-base font-medium text-white hover:text-purple-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  signOut()
                }}
                className="block w-full text-left text-base font-medium text-white hover:text-purple-400 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function Header() {
  const { user, loading, profile } = useAuth()
  const pathname = usePathname()

  // Don't show header on admin or account pages (they have their own layouts)
  if (pathname.startsWith('/admin') || pathname.startsWith('/account')) {
    return null
  }

  if (loading) {
    return (
      <header className="bg-black/95 backdrop-blur-md fixed w-full top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                Givva
              </span>
            </Link>
            
            {/* Show public navigation while loading instead of skeleton */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link
                href="/login"
                className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-orange-600 transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Menu className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-black/95 backdrop-blur-md fixed w-full top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              Givva
            </span>
          </Link>

          {user ? <AuthenticatedHeader /> : <PublicHeader />}
        </div>
      </div>
    </header>
  )
} 