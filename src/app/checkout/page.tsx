'use client'

import { useState } from 'react'
import { ArrowLeft, Zap, Shield, CreditCard, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function CheckoutPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: 'your@email.com',
    firstName: 'John',
    lastName: 'Doe',
    cardNumber: '1234 5678 9012 3456',
    expiryDate: 'MM/YY',
    cvv: '123',
    address: '123 Main Street',
    city: 'New York',
    zipCode: '10001'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCompletePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      router.push('/checkout/success')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <button 
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600">Complete your purchase</p>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="mb-8">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 sm:p-6">
            <div className="flex items-start space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg p-2">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-orange-500">🔥</span>
                  <h3 className="font-bold text-gray-900">Checkout Now - Gift Arrives Instantly via Email, Text or WhatsApp!</h3>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-500">⏰</span>
                    <span>High demand - book today</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-500">🎁</span>
                    <span>Premium experience awaits</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Contact & Payment Info */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">We&apos;ll send your confirmation here</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-6">
                <CreditCard className="w-6 h-6 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Payment Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Billing Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Experience Item */}
              <div className="flex items-start space-x-4 mb-6">
                <Image 
                  src="https://via.placeholder.com/80x80/A855F7/FFFFFF?text=Spa"
                  alt="Luxury Spa Day Experience"
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Luxury Spa Day Experience</h3>
                  <p className="text-sm text-gray-600 mb-2">Wellness & Spa</p>
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium inline-block">
                    Valid 12 months
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-900">
                  <span>Subtotal</span>
                  <span>$299</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-$100</span>
                </div>
                <div className="flex justify-between text-gray-900">
                  <span>Processing Fee</span>
                  <span>$0</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>$299</span>
                </div>
              </div>

              {/* Complete Purchase Button */}
              <button
                onClick={handleCompletePayment}
                className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 mb-4"
              >
                <Shield className="w-5 h-5" />
                <span>Complete Purchase - $299</span>
              </button>

              {/* Security Note */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-2">
                  <Shield className="w-4 h-4" />
                  <span>256-bit SSL encrypted</span>
                </div>
                <p className="text-xs text-gray-500">Your payment information is secure and protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 