'use client'

import { useState } from 'react'
import { Star, ChefHat, Camera, Music, Heart, Building, Utensils, Dumbbell, ChevronDown, ChevronUp, FileText, Image as ImageIcon, Rocket } from 'lucide-react'

export default function PartnerPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const partnerCategories = [
    {
      icon: ChefHat,
      title: "Culinary Artists",
      subtitle: "Cooking classes, wine tastings, food tours, private chef experiences",
      perfect: "Perfect for: Professional chefs, home cooks, sommeliers, food bloggers"
    },
    {
      icon: Camera,
      title: "Creative Professionals", 
      subtitle: "Photography workshops, art classes, craft sessions, design tutorials",
      perfect: "Perfect for: Photographers, artists, craftspeople, designers"
    },
    {
      icon: Music,
      title: "Entertainment Experts",
      subtitle: "Music lessons, dance classes, performance coaching, cultural experiences",
      perfect: "Perfect for: Musicians, dancers, performers, cultural guides"
    },
    {
      icon: Dumbbell,
      title: "Wellness Coaches",
      subtitle: "Fitness classes, yoga sessions, meditation workshops, health coaching",
      perfect: "Perfect for: Personal trainers, yoga instructors, wellness coaches"
    },
    {
      icon: Heart,
      title: "Spa & Wellness Centers",
      subtitle: "Massage therapy, beauty treatments, relaxation packages, wellness retreats",
      perfect: "Perfect for: Spa owners, massage therapists, beauty professionals"
    },
    {
      icon: Building,
      title: "Hotel Managers",
      subtitle: "Unique hotel experiences, local tours, concierge services, event hosting",
      perfect: "Perfect for: Hotel managers, concierge staff, hospitality professionals"
    },
    {
      icon: Utensils,
      title: "Restaurant Owners",
              subtitle: "Cooking classes, tasting menus, chef's table experiences, culinary tours",
      perfect: "Perfect for: Restaurant owners, executive chefs, culinary teams"
    },
    {
      icon: Star,
      title: "Experience Entrepreneurs",
      subtitle: "Adventure tours, cultural experiences, skill workshops, unique activities",
      perfect: "Perfect for: Tour guides, adventure leaders, workshop facilitators"
    }
  ]

  const steps = [
    {
      number: "01",
      title: "Fill Our Simple Form",
      description: "Tell us about your experience in just 5 minutes. No complicated paperwork or lengthy processes.",
      duration: "Takes 5 minutes",
      color: "text-purple-600"
    },
    {
      number: "02", 
      title: "We Create Your Listing",
      description: "Our team handles professional photos, compelling descriptions, and platform optimization.",
      duration: "Takes 24-48 hours",
      color: "text-pink-600"
    },
    {
      number: "03",
      title: "Start Earning Money",
      description: "Go live instantly. We handle bookings, payments, customer service, and marketing.",
      duration: "Takes Immediate",
      color: "text-orange-600"
    }
  ]

  const faqs = [
    {
      question: "How much does it cost to get started?",
      answer: "Getting started is completely free! There are no upfront costs, setup fees, or monthly charges. You only pay when you earn - we take a small commission from successful bookings."
    },
    {
      question: "What percentage do you take from bookings?",
      answer: "We take a 15% commission from successful bookings. This covers all marketing, customer service, payment processing, and platform maintenance. You keep 85% of every booking."
    },
    {
      question: "How quickly can I start earning money?",
      answer: "Most partners go live within 48 hours of submitting their application. Once approved, you can start receiving bookings immediately. Many partners see their first booking within the first week."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We provide 24/7 customer support, dedicated partner success managers, marketing assistance, professional photography, listing optimization, and comprehensive training materials."
    },
    {
      question: "What types of experiences work best?",
      answer: "Unique, personal experiences perform best - cooking classes, private tours, workshops, wellness sessions, and cultural activities. Experiences that create lasting memories and personal connections are most popular."
    },
    {
      question: "How do I get paid?",
      answer: "Payments are processed automatically and deposited directly to your bank account within 48 hours of the experience completion. You can track all earnings through your partner dashboard."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 sm:pt-20 pb-16 bg-gradient-to-br from-purple-50 via-white to-orange-50 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full mb-8 text-sm font-semibold">
            <Star className="w-4 h-4 mr-2" />
            Join 1000+ Experience Partners Earning More
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8">
            Turn Your{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Passion
            </span>{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Into Profit
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 mb-6 max-w-4xl mx-auto leading-relaxed">
            We handle everything from marketing to bookings while you focus on creating amazing experiences.{' '}
            <span className="text-gray-900 font-bold">Zero upfront costs, maximum earnings.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
            <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center">
              Become a Partner Today
              <Star className="w-5 h-5 ml-2" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-purple-500 rounded-full border-2 border-white"></div>
                <div className="w-10 h-10 bg-pink-500 rounded-full border-2 border-white"></div>
                <div className="w-10 h-10 bg-orange-500 rounded-full border-2 border-white"></div>
                <div className="w-10 h-10 bg-blue-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-gray-600 ml-4">1000+ partners earning avg. $2,500/month</span>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">$0</div>
              <div className="text-gray-600 font-medium">Setup Cost</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">85%</div>
              <div className="text-gray-600 font-medium">Revenue Share</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">48hr</div>
              <div className="text-gray-600 font-medium">Go Live</div>
            </div>
          </div>
        </div>
      </section>

      {/* Are You a Good Fit Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Are You a Good Fit?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're looking for passionate professionals and business owners who want to share their expertise and create memorable experiences for others.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-purple-200">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{category.title}</h3>
                <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed">
                  {category.subtitle}
                </p>
                <p className="text-xs text-gray-500 text-center italic">
                  {category.perfect}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started in 3 Simple Steps */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Get Started In{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">3</span>{' '}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From idea to income in less than 48 hours. No technical skills required.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center relative">
                <div className="absolute -top-4 left-6 bg-yellow-100 text-yellow-800 text-sm font-bold px-3 py-1 rounded-full">
                  {step.number}
                </div>
                
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4">
                  {index === 0 && <FileText className="w-8 h-8 text-white" />}
                  {index === 1 && <ImageIcon className="w-8 h-8 text-white" />}
                  {index === 2 && <Rocket className="w-8 h-8 text-white" />}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {step.description}
                </p>
                
                <div className={`inline-flex items-center ${step.color} bg-purple-50 px-4 py-2 rounded-full text-sm font-semibold`}>
                  {step.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about becoming an experience partner.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Let's Turn Your Services Into Sought-After Gifts
            </h2>
            <p className="text-xl text-gray-600">
              Fill out the form and we'll get back to you within 2 business days.
            </p>
          </div>
          
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <form className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Business Name"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <div>
                <input
                  type="text"
                  placeholder="Contact Person"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <div>
                <input
                  type="text"
                  placeholder="Business Location"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <div>
                <input
                  type="text"
                  placeholder="Website / Instagram / Booking Link"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <div>
                <textarea
                  placeholder="What do you offer?"
                  rows={4}
                  className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none"
                />
              </div>
              
              <div>
                <select className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900">
                  <option value="">Do you already have gift cards or packages?</option>
                  <option value="yes">Yes, we have existing gift offerings</option>
                  <option value="no">No, but we're interested in creating them</option>
                  <option value="considering">We're considering it</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-4 rounded-2xl text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Submit & Join Givva
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
} 