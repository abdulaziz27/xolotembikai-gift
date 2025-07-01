'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Star, Gift, ShoppingBag, Filter, X } from 'lucide-react'
import { Experience, FilterOptions } from '@/types/experiences'
import { experienceService, experienceUtils } from '@/lib/services/experiences'
import Image from 'next/image'

interface FilterState {
  priceRange: string[]
  occasion: string[]
  perfectFor: string[]
  interests: string[]
  giftType: string[]
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  
  const [sortBy, setSortBy] = useState('featured')
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    priceRange: [],
    occasion: [],
    perfectFor: [],
    interests: [],
    giftType: []
  })
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  
  const router = useRouter()

  // Fetch experiences and filter options
  const fetchExperiences = useCallback(async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const page = loadMore ? currentPage + 1 : 1
      
      // Convert filters to API params
      const priceRangeFilter = selectedFilters.priceRange[0]
      let priceMin, priceMax
      if (priceRangeFilter) {
        if (priceRangeFilter === 'Under $100') {
          priceMax = 99
        } else if (priceRangeFilter === '$100 - $200') {
          priceMin = 100
          priceMax = 200
        } else if (priceRangeFilter === '$200 - $300') {
          priceMin = 200
          priceMax = 300
        } else if (priceRangeFilter === '$300 - $400') {
          priceMin = 300
          priceMax = 400
        } else if (priceRangeFilter === '$500+') {
          priceMin = 500
        }
      }

      const response = await experienceService.getFrontendExperiences({
        page,
        limit: 12,
        occasions: selectedFilters.occasion,
        priceMin,
        priceMax,
        sortBy: sortBy === 'Most Popular' ? 'featured' : 
               sortBy === 'Price: Low to High' ? 'price_low' :
               sortBy === 'Price: High to Low' ? 'price_high' :
               sortBy === 'Highest Rated' ? 'rating' :
               sortBy === 'Newest' ? 'newest' : 'featured'
      })

      if (loadMore) {
        setExperiences(prev => [...prev, ...response.experiences])
        setCurrentPage(page)
      } else {
        setExperiences(response.experiences)
        setCurrentPage(1)
      }
      
      setTotalCount(response.total)
      setHasMore(response.hasMore)
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [selectedFilters, sortBy, currentPage])

  const fetchFilterOptions = async () => {
    try {
      const options = await experienceService.getFilterOptions()
      setFilterOptions(options)
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  useEffect(() => {
    fetchExperiences()
  }, [selectedFilters, sortBy, fetchExperiences])

  const handleFilterChange = (category: keyof FilterState, value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[category]
      const newValues = currentValues.includes(value) 
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value]
      
      return {
        ...prev,
        [category]: newValues
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 bg-white rounded-2xl p-6 h-fit shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Filters</h2>
            
            {/* Price Range */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <ShoppingBag className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Price Range</h3>
              </div>
              <div className="space-y-3">
                {filterOptions?.priceRanges.map((range, index) => (
                  <label key={index} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.priceRange.includes(range.label)}
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
                {filterOptions?.occasions.map((occasion, index) => (
                  <label key={index} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.occasion.includes(occasion.label)}
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
                {filterOptions?.perfectFor.map((item, index) => (
                  <label key={index} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.perfectFor.includes(item.label)}
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
                {filterOptions?.interests.map((interest, index) => (
                  <label key={index} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.interests.includes(interest.label)}
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
                {filterOptions?.giftTypes.map((type, index) => (
                  <label key={index} className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.giftType.includes(type.label)}
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

          {/* Mobile Filters Modal */}
          {isMobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="fixed inset-y-0 left-0 w-80 bg-white p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Price Range */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <ShoppingBag className="w-5 h-5 text-purple-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Price Range</h3>
                  </div>
                  <div className="space-y-3">
                    {filterOptions?.priceRanges.map((range, index) => (
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
                    {filterOptions?.occasions.map((occasion, index) => (
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
                    {filterOptions?.perfectFor.map((item, index) => (
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
                    {filterOptions?.interests.map((interest, index) => (
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
                    {filterOptions?.giftTypes.map((type, index) => (
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

                {/* Apply Filters Button */}
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Perfect Gifts for You</h1>
                <p className="text-gray-600">
                  {loading ? 'Loading...' : `Showing ${totalCount} amazing gift options`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm sm:text-base">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 pr-8 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                    <div className="h-40 sm:h-48 bg-gray-200" />
                    <div className="p-4 sm:p-6">
                      <div className="h-4 bg-gray-200 rounded mb-3" />
                      <div className="h-6 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded mb-4 w-2/3" />
                      <div className="h-10 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))
              ) : experiences.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No experiences found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                experiences.map((experience) => {
                  const priceOptions = experience.price_options || {}
                  const hasDiscount = Object.keys(priceOptions).length > 0
                  const discountPercentage = hasDiscount 
                    ? experienceUtils.calculateDiscount(Number(Object.values(priceOptions)[0]), experience.starting_price)
                    : 0

                  return (
                    <div 
                      key={experience.id} 
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer" 
                      onClick={() => router.push(`/experiences/${experience.slug}`)}
                    >
                      {/* Image */}
                      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-purple-100 to-orange-100">
                        {/* Badge */}
                        {experience.is_featured && (
                          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-purple-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                            Featured
                          </div>
                        )}

                        {/* Discount Badge */}
                        {hasDiscount && (
                          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                            Save {discountPercentage}%
                          </div>
                        )}
                        
                        {/* Image or placeholder */}
                        {experience.featured_image ? (
                          <Image 
                            src={experience.featured_image} 
                            alt={experience.title}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Gift className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-6">
                        {/* Category */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${experienceUtils.getCategoryColor(experience.category)}`}>
                            {experience.category}
                          </span>
                        </div>

                        {/* Title and Provider */}
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{experience.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-3">{experience.vendor?.name || 'No Vendor'}</p>

                        {/* Price and Rating */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl sm:text-2xl font-bold text-gray-900">
                              {experienceUtils.formatPrice(experience.starting_price, experience.currency)}
                            </span>
                            {hasDiscount && (
                              <span className="text-gray-400 line-through text-xs sm:text-sm">
                                {experienceUtils.formatPrice(Number(Object.values(priceOptions)[0]), experience.currency)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                              {experienceUtils.formatRating(experience.rating)}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500">({experience.total_bookings})</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button className="w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                          {experienceUtils.getActionButtonText(experience.category)}
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="text-center">
                <button 
                  onClick={() => fetchExperiences(true)}
                  disabled={loadingMore}
                  className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load More Amazing Gifts'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 