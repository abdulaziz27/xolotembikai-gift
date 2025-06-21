'use client'

import { useState } from 'react'
import { Check, Eye, Gift, Home, HelpCircle, Mail, CalendarDays } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const orderNumber = "#GIFT9025031798"

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🎉</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Payment Successful!</h1>
            <span className="text-2xl">🎉</span>
          </div>
          
          <p className="text-lg text-gray-600 mb-4">Your spa experience is confirmed!</p>
          
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold inline-block">
            Order {orderNumber}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            </div>
            
            <div className="flex items-start space-x-4">
              <img 
                src="https://via.placeholder.com/80x80/A855F7/FFFFFF?text=Spa"
                alt="Luxury Spa Day Experience"
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Luxury Spa Day Experience</h3>
                <p className="text-sm text-gray-600 mb-2">Wellness & Spa</p>
                <div className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium inline-block mb-3">
                  Valid 12 months
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">$299</span>
                </div>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <CalendarDays className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">What Happens Next?</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Confirmation Email Sent</h3>
                  <p className="text-sm text-gray-600">Check your inbox for order details and booking instructions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Book Your Experience</h3>
                  <p className="text-sm text-gray-600">Use your voucher code to book your preferred date and time</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Enjoy Your Experience</h3>
                  <p className="text-sm text-gray-600">Relax and enjoy your premium spa experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <HelpCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Our customer support team is available 24/7 to assist you with any questions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => {/* View order details logic */}}
            className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Eye className="w-5 h-5" />
            <span>View Order Details</span>
          </button>
          
          <button 
            onClick={() => router.push('/experiences')}
            className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Gift className="w-5 h-5" />
            <span>Send Another Gift</span>
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Homepage</span>
          </button>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@givva.com" className="text-purple-600 hover:text-purple-700">
              support@givva.com
            </a>
            {' '}or call{' '}
            <a href="tel:+60312345678" className="text-purple-600 hover:text-purple-700">
              +60 3 1234 5678
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 