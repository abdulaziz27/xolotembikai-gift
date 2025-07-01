'use client'

import { Star, Heart, Lightbulb, Gift, Users, Crown, Monitor } from 'lucide-react'
import { ChevronDown } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-purple-50 via-white to-orange-50 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
            We're{' '}
            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
              Givva
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-gray-600 mb-6 max-w-4xl mx-auto leading-relaxed">
            Transforming ordinary moments into{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
              extraordinary gifting experiences
            </span>
            <br />
            that create lasting memories and strengthen relationships.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              Discover Our Story
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-purple-500 hover:text-purple-600 transition-all duration-300">
              Explore Platform
            </button>
          </div>
          
          <div className="flex justify-center">
            <ChevronDown className="w-8 h-8 text-gray-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Second Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-8"></div>
            <h2 className="text-4xl lg:text-6xl font-bold leading-tight mb-8">
              Gifting should feel{' '}
              <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                meaningful
              </span>
              {' — not '}
              <span className="text-gray-900">stressful.</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              We make it easy to gift unforgettable experiences your loved ones will actually remember.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Explore All Experiences
              </button>
              <button className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                Give Your First Experience
              </button>
            </div>
          </div>
          
          <div className="w-20 h-20 bg-orange-200 rounded-full ml-auto mb-8"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border-2 border-gradient-to-r from-purple-500 to-orange-500 p-8 shadow-lg">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  1000+
                </div>
                <div className="text-gray-600 font-medium">Unique Experiences</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent mb-2">
                  50+
                </div>
                <div className="text-gray-600 font-medium">Partner Locations</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
                  10K+
                </div>
                <div className="text-gray-600 font-medium">Happy Recipients</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  98%
                </div>
                <div className="text-gray-600 font-medium">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Givva Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            About <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Givva</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-orange-500 mx-auto mb-12"></div>
          
          <div className="max-w-4xl mx-auto space-y-8 text-lg text-gray-700 leading-relaxed">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Born from a simple belief:</h3>
              <p className="text-gray-600">
                Every gift should tell a story. Every moment should be memorable. Every experience should bring people closer together.
              </p>
            </div>
            
            <p>
              Founded in 2023, Givva emerged from the frustration of generic gift-giving. We saw a world where{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                thoughtful gestures were becoming thoughtless transactions
              </span>, and we knew we had to change that.
            </p>
            
            <p>
              Today, we're proud to be the platform that helps millions create{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                personalized gifting experiences that matter
              </span>. We believe in the power of connection, the beauty of thoughtfulness, and the magic that happens when technology meets genuine human emotion.
            </p>
            
            <p className="font-semibold text-gray-900">
              At Givva, we're not just changing how gifts are given – we're transforming how relationships are celebrated, one meaningful experience at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Our <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Values</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-orange-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            These principles guide every decision we make and every experience we create
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* First Row */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Authenticity</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe genuine connections come from authentic expressions of care.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                We constantly push the boundaries of what's possible in gifting.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Connection</h3>
              <p className="text-gray-600 leading-relaxed">
                At our core, we're about bringing people together.
              </p>
            </div>
            
            {/* Second Row */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Creativity</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe genuine connections come from authentic expressions of care.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Thoughtfulness</h3>
              <p className="text-gray-600 leading-relaxed">
                We constantly push the boundaries of what's possible in gifting.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                At our core, we're about bringing people together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              What We <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Do</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We transform the art of giving into unforgettable experiences
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold mb-8">
                Revolutionizing <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Gift-Giving</span>
              </h3>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Our platform combines cutting-edge technology with human intuition to create gifting experiences that go beyond the ordinary. We don't just deliver gifts—we deliver joy, surprise, and connection.
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                See How It Works
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3 flex-shrink-0">
                    <Monitor className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold">Personalized Experiences</h4>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                        10x More Personal
                      </span>
                    </div>
                    <p className="text-gray-600">
                      AI-powered recommendations that understand the recipient&apos;s preferences, interests, and personality.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-3 flex-shrink-0">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold">Seamless Delivery</h4>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                        99.9% On Time
                      </span>
                    </div>
                    <p className="text-gray-600">
                      From digital experiences to physical gifts, we handle everything with precision and care.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl p-3 flex-shrink-0">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold">Memory Creation</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                        Lasting Memories
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Every gift comes with tools to capture and share the special moments they create.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* In The Spotlight Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            In The <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Spotlight</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-orange-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Industry leaders and media outlets are talking about Givva
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* TechCrunch */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-bold text-green-600">TC</div>
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="text-lg text-gray-700 mb-6 italic leading-relaxed">
                &quot;Givva is revolutionizing the gifting industry with AI-powered personalization that actually works.&quot;
              </blockquote>
              <div className="text-sm text-gray-500">— Sarah Chen, Senior Editor</div>
            </div>
            
            {/* Forbes */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-bold text-blue-600">Forbes</div>
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="text-lg text-gray-700 mb-6 italic leading-relaxed">
                &quot;The future of gift-giving is here, and it&apos;s more thoughtful than ever before.&quot;
              </blockquote>
              <div className="text-sm text-gray-500">— Marcus Rodriguez, Tech Columnist</div>
            </div>
            
            {/* Wired */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-bold text-black">Wired</div>
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="text-lg text-gray-700 mb-6 italic leading-relaxed">
                &quot;Finally, a platform that understands that gifts are about connection, not just consumption.&quot;
              </blockquote>
              <div className="text-sm text-gray-500">— Dr. Amanda Foster, Innovation Analyst</div>
            </div>
            
            {/* Fast Company */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-bold text-red-600">Fast Company</div>
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="text-lg text-gray-700 mb-6 italic leading-relaxed">
                &quot;Givva&apos;s approach to experiential gifting is setting new standards for the industry.&quot;
              </blockquote>
              <div className="text-sm text-gray-500">— James Wilson, Senior Writer</div>
          </div>
        </div>
      </div>
      </section>
    </div>
  )
} 