'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import Link from 'next/link'
import { experienceService } from '@/lib/services/experiences'
import { ExperienceForm, Vendor, Category, Occasion, CURRENCIES, DIFFICULTY_LEVELS } from '@/types/experiences'
import FileUploader from '@/components/admin/file-uploader'
import { vendorService } from "@/lib/services/vendors"
import type { Vendor as VendorType } from "@/types/vendors"


export default function CreateExperiencePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [vendors, setVendors] = useState<VendorType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [occasions, setOccasions] = useState<Occasion[]>([])
  const [formData, setFormData] = useState<ExperienceForm>({
    title: '',
    short_description: '',
    long_description: '', // Changed from full_description
    category: '',
    occasions: [],
    starting_price: 0,
    price_options: [],
    currency: 'MYR', // Changed default to MYR
    is_variable_pricing: false,
    vendor_id: undefined,
    location: '',
    address: '',
    gallery: [], // Changed from images
    featured_image: '',
    video_url: '',
    duration: '',
    duration_hours: undefined, // Added
    max_participants: 0,
    min_participants: 1, // Added
    min_age: 0,
    difficulty_level: 'Easy',
    redemption_instructions: '',
    requirements: [], // Changed from booking_requirements
    inclusions: [], // Changed from included_items
    exclusions: [], // Changed from excluded_items
    cancellation_policy: '',
    vendor_type: 'manual',
    api_endpoint: '',
    manual_codes: [],
    seo_title: '',
    seo_description: '',
    tags: [],
    status: 'draft',
    is_featured: false,
    is_gift_wrappable: true,
    allows_custom_message: true,
    allows_scheduling: true,
  })

  // Fetch vendors, categories, and occasions
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true)
      try {
        const [vendorsRes, categoriesRes, occasionsRes] = await Promise.all([
          fetch('/api/vendors'),
          fetch('/api/categories'),
          fetch('/api/occasions')
        ])
        
        // Handle vendors
        if (vendorsRes.ok) {
          const vendorsData = await vendorsRes.json()
          setVendors(Array.isArray(vendorsData) ? vendorsData : [])
        } else {
          console.error('Failed to fetch vendors:', vendorsRes.status)
          setVendors([])
        }
        
        // Handle categories
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(Array.isArray(categoriesData) ? categoriesData : [])
        } else {
          console.error('Failed to fetch categories:', categoriesRes.status)
          setCategories([])
        }
        
        // Handle occasions
        if (occasionsRes.ok) {
          const occasionsData = await occasionsRes.json()
          setOccasions(Array.isArray(occasionsData) ? occasionsData : [])
        } else {
          console.error('Failed to fetch occasions:', occasionsRes.status)
          setOccasions([])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        // Set empty arrays on error to prevent crashes
        setVendors([])
        setCategories([])
        setOccasions([])
      } finally {
        setDataLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        alert('Please enter a title')
        return
      }
      
      if (!formData.short_description.trim()) {
        alert('Please enter a short description')
        return
      }
      
      if (!formData.long_description.trim()) {
        alert('Please enter a full description')
        return
      }
      
      if (!formData.category) {
        alert('Please select a category')
        return
      }
      
      if (formData.starting_price <= 0) {
        alert('Please enter a valid starting price')
        return
      }

      const experience = await experienceService.createExperience(formData)
      alert('Experience created successfully!')
      router.push('/admin/experiences')
    } catch (error: any) {
      console.error('Error creating experience:', error)
      
      // More specific error messages
      if (error.message?.includes('403')) {
        alert('You do not have permission to create experiences. Please ensure you are logged in as an admin.')
      } else if (error.message?.includes('400')) {
        alert('Please check your input data and try again.')
      } else if (error.message?.includes('500')) {
        alert('Server error. Please try again later.')
      } else {
        alert(`Failed to create experience: ${error.message || 'Unknown error'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleArrayInputChange = (field: keyof ExperienceForm, value: string) => {
    if (typeof formData[field] === 'object' && Array.isArray(formData[field])) {
      const items = value.split('\n').filter(item => item.trim())
      setFormData(prev => ({ ...prev, [field]: items }))
    }
  }

  const handleOccasionChange = (occasion: string) => {
    setFormData(prev => ({
      ...prev,
      occasions: prev.occasions.includes(occasion)
        ? prev.occasions.filter(o => o !== occasion)
        : [...prev.occasions, occasion]
    }))
  }

  // Show loading state while fetching data
  if (dataLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/experiences"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Experiences
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Experience</h1>
              <p className="text-gray-600">Add a new experience or gift card</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/experiences"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Experiences
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Experience</h1>
            <p className="text-gray-600">Add a new experience or gift card</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
          <button
            type="submit"
            form="experience-form"
            disabled={loading}
            className="flex items-center px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-orange-500 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Creating...' : 'Create Experience'}
          </button>
        </div>
      </div>

      {/* Form */}
      <form id="experience-form" onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Experience title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                required
                value={formData.short_description}
                onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                maxLength={200}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Brief description (max 200 characters)"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.short_description.length}/200 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select category</option>
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor
              </label>
              <select
                value={formData.vendor_id || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, vendor_id: e.target.value || undefined }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select vendor (optional)</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="City or location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Full address for the experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Price *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.starting_price}
                onChange={(e) => setFormData(prev => ({ ...prev, starting_price: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {CURRENCIES.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 2 hours, Full day"
              />
            </div>
          </div>
        </div>

        {/* Occasions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Occasions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {occasions && occasions.length > 0 ? (
              occasions.map((occasion: Occasion) => (
                <label key={occasion.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.occasions.includes(occasion.name)}
                    onChange={() => handleOccasionChange(occasion.name)}
                    className="rounded text-purple-600 mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    {occasion.icon} {occasion.name}
                  </span>
                </label>
              ))
            ) : (
              <div className="col-span-4">
                <p className="text-sm text-gray-500 italic">No occasions available. You can add them later.</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Content & Details</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description *
              </label>
              <textarea
                required
                value={formData.long_description}
                onChange={(e) => setFormData(prev => ({ ...prev, long_description: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Detailed description of the experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <FileUploader
                onUploadComplete={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
                onError={(error) => console.error('Upload error:', error)}
                acceptedFileTypes="image/*"
              />
              {formData.featured_image && (
                <div className="mt-3">
                  <img
                    src={formData.featured_image}
                    alt="Featured image preview"
                    className="w-32 h-20 object-cover rounded-lg border"
                  />
                  <p className="text-sm text-gray-500 mt-1">Image uploaded successfully</p>
                </div>
              )}
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's Included (one per line)
              </label>
              <textarea
                value={formData.inclusions.join('\n')}
                onChange={(e) => handleArrayInputChange('inclusions', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="90-minute massage&#10;Spa facilities access&#10;Healthy lunch"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redemption Instructions
              </label>
              <textarea
                value={formData.redemption_instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, redemption_instructions: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="How customers can redeem this experience"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="rounded text-purple-600 mr-3"
              />
              <span className="text-sm text-gray-700">Featured experience (shows on homepage)</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_gift_wrappable}
                onChange={(e) => setFormData(prev => ({ ...prev, is_gift_wrappable: e.target.checked }))}
                className="rounded text-purple-600 mr-3"
              />
              <span className="text-sm text-gray-700">Allow gift wrapping</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.allows_custom_message}
                onChange={(e) => setFormData(prev => ({ ...prev, allows_custom_message: e.target.checked }))}
                className="rounded text-purple-600 mr-3"
              />
              <span className="text-sm text-gray-700">Allow custom message</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.allows_scheduling}
                onChange={(e) => setFormData(prev => ({ ...prev, allows_scheduling: e.target.checked }))}
                className="rounded text-purple-600 mr-3"
              />
              <span className="text-sm text-gray-700">Allow scheduling for future delivery</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  )
} 