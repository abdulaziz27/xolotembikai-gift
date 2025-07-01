import { Suspense } from 'react'
import LoginForm from '@/components/auth/login-form'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back to{' '}
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Givva
            </span>
          </h2>
          <p className="text-gray-600">
            Sign in to continue your gifting journey
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <Suspense fallback={
            <div className="space-y-6">
              <div className="animate-pulse bg-gray-200 h-10 rounded-xl"></div>
              <div className="animate-pulse bg-gray-200 h-10 rounded-xl"></div>
              <div className="flex justify-between">
                <div className="animate-pulse bg-gray-200 h-5 w-24 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-5 w-32 rounded"></div>
              </div>
              <div className="animate-pulse bg-gray-200 h-10 rounded-xl"></div>
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-purple-600 hover:text-purple-800 transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-purple-600 hover:text-purple-800 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 