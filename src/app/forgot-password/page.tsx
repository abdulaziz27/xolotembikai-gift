import ForgotPasswordForm from '@/components/auth/forgot-password-form'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function ForgotPasswordPage() {
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
            Reset your password
          </h2>
          <p className="text-gray-600">
            Don't worry, we'll help you get back to{' '}
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent font-semibold">
              Givva
            </span>
          </p>
        </div>

        {/* Forgot Password Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <ForgotPasswordForm />
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need more help?{' '}
            <Link href="/contact" className="text-purple-600 hover:text-purple-800 transition-colors font-medium">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}