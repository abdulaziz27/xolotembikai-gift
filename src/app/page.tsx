'use client'

import { useState } from 'react'
import { Search, Globe, Zap, Target, Shield, Smartphone, Heart, Star } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  const [activeTab, setActiveTab] = useState('occasion')

  const experiences = [
    {
      id: 1,
      title: "Luxury Spa Day",
      category: "Wellness",
      price: 299,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
      rating: 4.9
    },
    {
      id: 2,
      title: "Wine Tasting Experience", 
      category: "Culinary",
      price: 199,
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
      rating: 4.8
    },
    {
      id: 3,
      title: "Adventure Photography",
      category: "Adventure", 
      price: 249,
      image: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&h=300&fit=crop",
      rating: 4.9
    },
    {
      id: 4,
      title: "Cooking Masterclass",
      category: "Culinary",
      price: 179,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      rating: 4.7
    },
    {
      id: 5,
      title: "Art Workshop",
      category: "Creative",
      price: 129,
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      rating: 4.8
    }
  ]

  const cities = ["New York", "Los Angeles", "Chicago", "Miami", "San Francisco", "Austin"]

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, NY",
      rating: 5,
      text: "I gifted my sister a spa day package and she absolutely loved it! The booking process was so easy and the experience exceeded her expectations. Will definitely use Givva again!"
    },
    {
      name: "Michael Chen",
      location: "San Francisco, CA", 
      rating: 5,
      text: "Perfect for corporate gifts! We sent wine tasting experiences to our top clients and the feedback was incredible. Professional service and unforgettable experiences."
    },
    {
      name: "Emily Rodriguez",
      location: "Miami, FL",
      rating: 5,
      text: "The hot air balloon adventure I received as a birthday gift was magical! From booking to the actual experience, everything was flawless. Thank you for creating such beautiful memories!"
    },
    {
      name: "David Thompson",
      location: "Chicago, IL",
      rating: 5,
      text: "Gave my wife a cooking class for our anniversary. She learned so much and had an amazing time. The flexibility to book when convenient made it even better!"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-purple-50 to-orange-50 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Don&apos;t Give{' '}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Boring
                  </span>{' '}
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Gifts
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Give{' '}
                  <span className="text-purple-600 font-semibold">unforgettable experiences</span>{' '}
                  that create{' '}
                  <span className="text-pink-600 font-semibold">lasting memories</span>.
                  From thrilling adventures to relaxing retreats - we&apos;ve got the perfect gift for everyone.
                </p>
              </div>

              <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Start Gifting Magic</span>
              </button>

              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-orange-500" />
                  <span>Browse 1000+ experiences</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span>Instant digital delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>4.9/5 rating</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    50K+
                  </div>
                  <div className="text-sm text-gray-600">Happy Gifters</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    1000+
                  </div>
                  <div className="text-sm text-gray-600">Experiences</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">
                    4.9 ⭐
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
        <Image
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop"
                  alt="Person enjoying experience"
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-semibold text-sm">Digital Gift Card</div>
                      <div className="text-xs text-gray-600">Delivered Instantly</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose GiftPass?</h2>
            <p className="text-xl text-gray-600">Making gifting extraordinary with unmatched convenience and quality</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-gray-600">Send gifts to friends and family across the US, Singapore, and Malaysia with just a few clicks.</p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Delivery</h3>
              <p className="text-gray-600">Digital passes delivered immediately via email, SMS, or our mobile app. No waiting required!</p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated Experiences</h3>
              <p className="text-gray-600">Handpicked activities from trusted partners ensuring quality experiences every time.</p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Bank-level security for all transactions. Your data and payments are always protected.</p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
              <p className="text-gray-600">Simple redemption process. Recipients can book their experiences through our user-friendly platform.</p>
            </div>

            <div className="text-center p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Touch</h3>
              <p className="text-gray-600">Add personal messages, custom packaging, and schedule delivery for special moments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Find Perfect Experience Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Find The Perfect Experience</h2>
            <p className="text-xl text-gray-600 mb-8">Browse by occasion, interest, or location to discover amazing gifts</p>

            {/* Filter Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-full p-1 shadow-lg">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setActiveTab('occasion')}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeTab === 'occasion'
                        ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    By Occasion
                  </button>
                  <button
                    onClick={() => setActiveTab('interest')}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeTab === 'interest'
                        ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    By Interest
                  </button>
                  <button
                    onClick={() => setActiveTab('location')}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      activeTab === 'location'
                        ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    By Location
                  </button>
                </div>
              </div>
            </div>

            {/* Location Search */}
            {activeTab === 'location' && (
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter city, state, or zip code"
                    className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-orange-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300">
                    Search
                  </button>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  {cities.map((city) => (
                    <button
                      key={city}
                      className="px-4 py-2 bg-white rounded-full text-gray-600 hover:bg-gray-50 hover:text-purple-600 transition-colors border border-gray-200"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Occasion Categories */}
          {activeTab === 'occasion' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Birthday', emoji: '🎂', count: 120, description: 'Celebrate another year with unforgettable experiences' },
                { name: 'Anniversary', emoji: '💖', count: 85, description: 'Romantic experiences for special milestones' },
                { name: 'Graduation', emoji: '🎓', count: 65, description: 'Celebrate achievements with memorable rewards' },
                { name: "Mother's Day", emoji: '🌸', count: 120, description: 'Show appreciation with relaxing experiences' }
              ].map((occasion) => (
                <div key={occasion.name} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer group relative">
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    ${occasion.count}
                  </div>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {occasion.emoji}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{occasion.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {occasion.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Interest Categories */}
          {activeTab === 'interest' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Foodie', emoji: '🍕', count: 140, description: 'Culinary adventures and dining experiences' },
                { name: 'Adrenaline Junkie', emoji: '🏃', count: 220, description: 'Thrilling adventures and extreme sports' },
                { name: 'Culture Buff', emoji: '🏛️', count: 90, description: 'Museums, galleries, and cultural experiences' },
                { name: 'Wellness Seeker', emoji: '🧘', count: 160, description: 'Spa treatments and relaxation experiences' }
              ].map((interest) => (
                <div key={interest.name} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer group relative">
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    ${interest.count}
                  </div>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {interest.emoji}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{interest.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {interest.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Gifts Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Gifts</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">Trending experiences that create unforgettable memories</p>
            
            <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
              View All Experiences
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {experiences.map((experience) => (
              <div key={experience.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
          <Image
                    src={experience.image}
                    alt={experience.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-sm font-medium">
                    {experience.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-sm font-bold">
                    ${experience.price}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-center bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {experience.title}
                  </h3>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                    Gift Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Gifting extraordinary experiences is easier than you think</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Browse & Choose",
                description: "Explore our curated collection of amazing experiences across categories and locations",
                icon: Search,
                gradient: "from-purple-500 to-pink-500"
              },
              {
                step: 2,
                title: "Purchase & Send",
                description: "Buy the perfect experience and send it instantly via email or schedule delivery",
                icon: Heart,
                gradient: "from-pink-500 to-red-500"
              },
              {
                step: 3,
                title: "Book When Ready",
                description: "Recipients can book their experience at their convenience with our flexible scheduling",
                icon: Target,
                gradient: "from-orange-500 to-yellow-500"
              },
              {
                step: 4,
                title: "Create Memories",
                description: "Enjoy unforgettable moments and create lasting memories that go beyond material gifts",
                icon: Star,
                gradient: "from-purple-500 to-blue-500"
              }
            ].map((step) => (
              <div key={step.step} className="text-center group">
                <div className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real stories from people who&apos;ve created unforgettable memories</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-orange-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                  </div>
                </div>
                <div className="flex text-yellow-500 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">&quot;{testimonial.text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Never Miss a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400">Gift Moment</span>
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Get exclusive offers, new experience alerts, and gifting inspiration delivered to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row max-w-lg mx-auto space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
