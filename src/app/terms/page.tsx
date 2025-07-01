'use client'

import { useState } from 'react'
import { FileText, Shield } from 'lucide-react'

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState('privacy')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Terms &{' '}
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Privacy
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your privacy and our terms of service - everything you need to know
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-2xl p-2">
              <button
                onClick={() => setActiveTab('terms')}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'terms'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-5 h-5 mr-2" />
                Terms of Service
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'privacy'
                    ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Shield className="w-5 h-5 mr-2" />
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg">
            {activeTab === 'privacy' ? (
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mb-8">
                  Privacy Policy
                </h2>
                
                <div className="space-y-8">
                  {/* Information We Collect */}
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h3>
                    <div className="space-y-4 text-gray-700">
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Account Information:</p>
                        <p>Name, email address, phone number, and profile information you provide.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Booking Information:</p>
                        <p>Details about your reservations, preferences, and booking history.</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Usage Data:</p>
                        <p>How you interact with our platform, including pages visited and features used.</p>
                      </div>
                    </div>
                  </section>

                  {/* How We Use Your Information */}
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        To facilitate bookings and provide customer support
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        To communicate important updates about your reservations
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        To improve our platform and develop new features
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        To send marketing communications (with your consent)
                      </li>
                    </ul>
                  </section>

                  {/* Information Sharing */}
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Information Sharing</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy. We may share your information with experience providers to fulfill your bookings.
                    </p>
                  </section>

                  {/* Data Security */}
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Data Security</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                  </section>

                  {/* Your Rights */}
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Rights</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Access and update your personal information
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Request deletion of your account and data
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Opt-out of marketing communications
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Request a copy of your personal data
                      </li>
                    </ul>
                  </section>

                  {/* Contact Information */}
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h3>
                    <p className="text-gray-700 leading-relaxed">
                      If you have any questions about this Privacy Policy, please contact us at privacy@givva.com or through our contact form.
                    </p>
                  </section>

                  {/* Last Updated */}
                  <section className="pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Last updated: January 2024
                    </p>
                  </section>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Terms of Service
                </h2>
                
                <div className="space-y-8">
                  {/* Acceptance of Terms */}
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Acceptance of Terms</h3>
                    <p className="text-gray-700 leading-relaxed">
                      By accessing and using Givva's platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </section>

                  {/* Use License */}
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Use License</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Permission is granted to temporarily access Givva's platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Modify or copy the materials
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Use the materials for any commercial purpose or for any public display
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Attempt to reverse engineer any software contained on the platform
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Remove any copyright or other proprietary notations from the materials
                      </li>
                    </ul>
                  </section>

                  {/* User Accounts */}
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">User Accounts</h3>
                    <p className="text-gray-700 leading-relaxed">
                      When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for maintaining the security of your account.
                    </p>
                  </section>

                  {/* Booking and Payments */}
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Booking and Payments</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      All bookings are subject to availability and confirmation. Payment is required at the time of booking. Cancellation policies vary by experience provider and are clearly stated during the booking process.
                    </p>
                  </section>

                  {/* Prohibited Uses */}
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Prohibited Uses</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      You may not use our service:
                    </p>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        For any unlawful purpose or to solicit others to perform unlawful acts
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        To infringe upon or violate our intellectual property rights or the intellectual property rights of others
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
                      </li>
                    </ul>
                  </section>

                  {/* Disclaimer */}
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Disclaimer</h3>
                    <p className="text-gray-700 leading-relaxed">
                      The information on this platform is provided on an 'as is' basis. To the fullest extent permitted by law, Givva excludes all representations, warranties, conditions and terms relating to our platform and the use of this platform.
                    </p>
                  </section>

                  {/* Limitations */}
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Limitations</h3>
                    <p className="text-gray-700 leading-relaxed">
                      In no event shall Givva or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Givva&apos;s platform.
                    </p>
                  </section>

                  {/* Contact Information */}
                  <section>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                    <p className="text-gray-700 leading-relaxed">
                      If you have any questions about these Terms of Service, please contact us at legal@givva.com or through our contact form.
                    </p>
                  </section>

                  {/* Last Updated */}
                  <section className="pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Last updated: January 2024
                    </p>
                  </section>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
} 