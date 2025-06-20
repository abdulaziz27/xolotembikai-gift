'use client'

import { useState } from 'react'
import { ChevronDown, Star, Gift, ShoppingBag } from 'lucide-react'

interface FilterState {
  priceRange: string[]
  occasion: string[]
  perfectFor: string[]
  interests: string[]
  giftType: string[]
}

export default function ExperiencesPage() {
  const [sortBy, setSortBy] = useState('Most Popular')
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    priceRange: [],
    occasion: [],
    perfectFor: [],
    interests: [],
    giftType: []
  })

  // Debug log for filters (can be removed in production)
  console.log('Current filters:', selectedFilters)

  const priceRanges = [
    { label: 'Under $100', count: 306 },
    { label: '$100 - $200', count: 98 },
    { label: '$200 - $300', count: 78 },
    { label: '$300 - $400', count: 45 },
    { label: '$500+', count: 13 }
  ]

  const occasions = [
    { label: 'Birthday', count: 245 },
    { label: 'Anniversary', count: 89 },
    { label: 'Graduation', count: 67 },
    { label: 'Holiday', count: 189 },
    { label: 'Thank You', count: 123 },
    { label: 'Just Because', count: 156 }
  ]

  const perfectFor = [
    { label: 'For Her', count: 189 },
    { label: 'For Him', count: 167 },
    { label: 'For Kids', count: 98 },
    { label: 'For Teens', count: 76 },
    { label: 'For Couples', count: 54 }
  ]

  const interests = [
    { label: 'Food & Dining', count: 234 },
    { label: 'Wellness & Spa', count: 145 },
    { label: 'Adventure & Sports', count: 87 },
    { label: 'Arts & Culture', count: 92 },
    { label: 'Tech & Gaming', count: 78 },
    { label: 'Fashion & Beauty', count: 156 }
  ]

  const giftTypes = [
    { label: 'General Gift Card', count: 267 },
    { label: 'Custom Experience', count: 210 }
  ]

  const experiences = [
    {
      id: 1,
      title: 'Spa Day Experience Package',
      provider: 'Serenity Wellness',
      price: 150,
      originalPrice: 200,
      rating: 4.9,
      reviews: 234,
      categories: ['Wellness', 'Relaxation'],
      badge: 'Popular',
      badgeColor: 'bg-purple-500',
      image: 'spa-experience'
    },
    {
      id: 2,
      title: 'Fine Dining Restaurant Card',
      provider: 'Culinary Delights',
      price: 100,
      originalPrice: null,
      rating: 4.8,
      reviews: 189,
      categories: ['Food', 'Dining'],
      badge: '25% OFF',
      badgeColor: 'bg-green-500',
      image: 'dining-card'
    },
    {
      id: 3,
      title: 'Adventure Sports Package',
      provider: 'Thrill Seekers',
      price: 250,
      originalPrice: 300,
      rating: 4.7,
      reviews: 156,
      categories: ['Adventure', 'Sports'],
      badge: '17% OFF',
      badgeColor: 'bg-green-500',
      image: 'adventure-sports'
    },
    {
      id: 4,
      title: 'Tech Store Gift Card',
      provider: 'Digital World',
      price: 75,
      originalPrice: null,
      rating: 4.9,
      reviews: 312,
      categories: ['Technology', 'Gadgets'],
      badge: 'Popular',
      badgeColor: 'bg-purple-500',
      image: 'tech-card'
    },
    {
      id: 5,
      title: 'Art & Culture Experience',
      provider: 'Creative Spaces',
      price: 125,
      originalPrice: null,
      rating: 4.6,
      reviews: 98,
      categories: ['Arts', 'Culture'],
      badge: 'Trending',
      badgeColor: 'bg-orange-500',
      image: 'art-culture'
    },
    {
      id: 6,
      title: 'Fashion Boutique Card',
      provider: 'Style Central',
      price: 200,
      originalPrice: 250,
      rating: 4.5,
      reviews: 267,
      categories: ['Fashion', 'Style'],
      badge: '20% OFF',
      badgeColor: 'bg-green-500',
      image: 'fashion-card'
    }
  ]

  const handleFilterChange = (category: keyof FilterState, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value) 
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 bg-white rounded-2xl p-6 h-fit shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
            
            {/* Price Range */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <ShoppingBag className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Price Range</h3>
              </div>
              <div className="space-y-3">
                {priceRanges.map((range, index) => (
                  <label key={index} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        onChange={() => handleFilterChange('priceRange', range.label)}
                      />
                      <span className="ml-3 text-gray-700">{range.label}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{range.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Gift className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Occasion</h3>
              </div>
              <div className="space-y-3">
                {occasions.map((occasion, index) => (
                  <label key={index} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        onChange={() => handleFilterChange('occasion', occasion.label)}
                      />
                      <span className="ml-3 text-gray-700">{occasion.label}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{occasion.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Perfect For */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Perfect For</h3>
              </div>
              <div className="space-y-3">
                {perfectFor.map((item, index) => (
                  <label key={index} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        onChange={() => handleFilterChange('perfectFor', item.label)}
                      />
                      <span className="ml-3 text-gray-700">{item.label}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{item.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <ShoppingBag className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Interests</h3>
              </div>
              <div className="space-y-3">
                {interests.map((interest, index) => (
                  <label key={index} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        onChange={() => handleFilterChange('interests', interest.label)}
                      />
                      <span className="ml-3 text-gray-700">{interest.label}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{interest.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gift Type */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Gift className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Gift Type</h3>
              </div>
              <div className="space-y-3">
                {giftTypes.map((type, index) => (
                  <label key={index} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        onChange={() => handleFilterChange('giftType', type.label)}
                      />
                      <span className="ml-3 text-gray-700">{type.label}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{type.count}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfect Gifts for You</h1>
                <p className="text-gray-600">Showing 477 amazing gift options</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>Most Popular</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Highest Rated</option>
                    <option>Newest</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Experience Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {experiences.map((experience) => (
                <div key={experience.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-100 to-orange-100">
                    {/* Badge */}
                    <div className={`absolute top-4 left-4 ${experience.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {experience.badge}
                    </div>
                    {/* Placeholder for image */}
                    <div className="w-full h-full flex items-center justify-center">
                      <Gift className="w-16 h-16 text-gray-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {experience.categories.map((category, index) => (
                        <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs font-medium">
                          {category}
                        </span>
                      ))}
                    </div>

                    {/* Title and Provider */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{experience.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{experience.provider}</p>

                    {/* Price and Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">${experience.price}</span>
                        {experience.originalPrice && (
                          <span className="text-gray-400 line-through text-sm">${experience.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{experience.rating}</span>
                        <span className="text-sm text-gray-500">({experience.reviews})</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                      {experience.categories.includes('Technology') || experience.categories.includes('Food') || experience.categories.includes('Fashion') 
                        ? 'Get Gift Card' 
                        : 'Book Experience'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center">
              <button className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                Load More Amazing Gifts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 