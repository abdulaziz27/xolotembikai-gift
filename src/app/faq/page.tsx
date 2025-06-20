'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, User, X, Star } from 'lucide-react'

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqCategories = [
    {
      icon: User,
      title: "Account",
      color: "from-purple-500 to-pink-500",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Creating an account is simple! Click the 'Sign Up' button in the top right corner, enter your email address, create a password, and verify your email. You can also sign up using your Google or Facebook account for faster registration."
        },
        {
          question: "Can I change my account information?",
          answer: "Yes, you can update your account information anytime. Go to your profile settings where you can change your name, email address, phone number, and password. Some changes may require email verification for security purposes."
        },
        {
          question: "How do I reset my password?",
          answer: "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a reset link. Check your email (including spam folder) and follow the instructions to create a new password."
        }
      ]
    },
    {
      icon: X,
      title: "Cancellation",
      color: "from-pink-500 to-orange-500",
      questions: [
        {
          question: "Can I cancel my order?",
          answer: "Yes, you can cancel most orders before the experience is booked or within 24 hours of purchase. Digital gift cards can usually be cancelled within 2 hours. Go to your order history and click 'Cancel Order' or contact our support team."
        },
        {
          question: "How do I cancel a scheduled experience?",
          answer: "To cancel a scheduled experience, log into your account, go to 'My Bookings', find the experience you want to cancel, and click 'Cancel Booking'. Cancellation policies vary by experience provider, so check the specific terms for your booking."
        },
        {
          question: "What happens if I need to cancel last minute?",
          answer: "Last-minute cancellations (within 24 hours) may be subject to cancellation fees depending on the experience provider's policy. We recommend rescheduling when possible. Emergency cancellations due to illness or unforeseen circumstances are handled case-by-case."
        },
        {
          question: "Can I reschedule instead of canceling?",
          answer: "Absolutely! Rescheduling is often easier than canceling. Most experience providers allow free rescheduling up to 48 hours before your booking. Simply go to 'My Bookings' and select 'Reschedule' to choose a new date and time."
        }
      ]
    },
    {
      icon: Star,
      title: "Experiences",
      color: "from-purple-500 to-orange-500",
      questions: [
        {
          question: "How do I book an experience?",
          answer: "Browse our experiences, select the one you want, choose your preferred date and time, add any customizations, and proceed to checkout. You can book for yourself or as a gift for someone else. Payment is processed securely, and you'll receive confirmation immediately."
        },
        {
          question: "What types of experiences do you offer?",
          answer: "We offer a wide variety of experiences including culinary classes, wellness sessions, creative workshops, adventure activities, spa treatments, cultural tours, and much more. Each experience is carefully curated to ensure quality and memorable moments."
        },
        {
          question: "Can I customize an experience?",
          answer: "Many experiences offer customization options such as dietary preferences, skill levels, group sizes, or special requests. Look for the 'Customize' option when booking, or contact the experience provider directly through our platform to discuss specific needs."
        },
        {
          question: "What if the weather affects my outdoor experience?",
          answer: "For weather-dependent outdoor experiences, providers typically offer flexible rescheduling or alternative indoor activities. Check the experience details for weather policies. If severe weather forces cancellation, you'll receive a full refund or credit for future use."
        }
      ]
    }
  ]

  let questionIndex = 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 pt-16">
      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about creating magical gifting experiences
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                {/* Category Header */}
                <div className="flex items-center mb-8">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mr-4`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => {
                    const currentIndex = questionIndex++
                    return (
                      <div key={faqIndex} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <button
                          onClick={() => toggleFaq(currentIndex)}
                          className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                        >
                          <span className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</span>
                          {openFaq === currentIndex ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {openFaq === currentIndex && (
                          <div className="px-6 pb-6">
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Our support team is here to help you create the perfect gifting experience
          </p>
          
          <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Contact Support
          </button>
        </div>
      </section>
    </div>
  )
} 