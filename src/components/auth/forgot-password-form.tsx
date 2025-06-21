'use client'

import { useState } from 'react'
import { Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Check your email
          </h3>
          <p className="text-gray-600">
            We&apos;ve sent a password reset link to your email address. 
            Please check your inbox and follow the instructions to reset your password.
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-purple-600 hover:text-purple-800 transition-colors font-medium"
            >
              try again
            </button>
          </p>
          <Link 
            href="/login"
            className="flex items-center justify-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to login</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter your email address"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all duration-200"
        >
          Send reset link
        </button>
      </div>

      <div className="text-center">
        <Link 
          href="/login"
          className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to login</span>
        </Link>
      </div>
    </form>
  )
} 