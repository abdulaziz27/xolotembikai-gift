"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Eye,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Archive,
} from 'lucide-react'
import { experienceService } from '@/lib/services/experiences'
import { Experience } from '@/types/experiences'

export default function ExperienceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const experienceId = params?.id as string

  useEffect(() => {
    const fetchExperience = async () => {
      if (!experienceId) return

      try {
        setLoading(true)
        setError(null)
        const data = await experienceService.getExperienceById(experienceId)
        setExperience(data)
      } catch (error: any) {
        console.error('Error fetching experience:', error)
        setError(error.message || 'Failed to fetch experience')
      } finally {
        setLoading(false)
      }
    }

    fetchExperience()
  }, [experienceId])

  const handleDelete = async () => {
    if (!experience) return

    if (!window.confirm(`Are you sure you want to delete "${experience.title}"? This action cannot be undone.`)) {
      return
    }

    try {
      await experienceService.deleteExperience(experience.id)
      alert('Experience deleted successfully!')
      router.push('/admin/experiences')
    } catch (error: any) {
      console.error('Error deleting experience:', error)
      alert('Failed to delete experience: ' + (error.message || 'Unknown error'))
    }
  }

  const getStatusBadge = (status: string) => {
    const configs = {
      active: {
        icon: CheckCircle,
        className: 'bg-green-100 text-green-800 border-green-200',
        label: 'Active'
      },
      draft: {
        icon: AlertCircle,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        label: 'Draft'
      },
      archived: {
        icon: Archive,
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'Archived'
      }
    }

    const config = configs[status as keyof typeof configs] || configs.draft
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/experiences"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Experiences
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !experience) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/experiences"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Experiences
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Experience Not Found</h2>
            <p className="text-gray-600 mb-4">{error || 'The experience you are looking for does not exist.'}</p>
            <Link
              href="/admin/experiences"
              className="inline-flex items-center px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/experiences"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Experiences
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{experience.title}</h1>
            <p className="text-gray-600">Experience Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`/experiences/${experience.slug}`}
            target="_blank"
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Live
            <ExternalLink className="w-3 h-3 ml-1" />
          </Link>
          <Link
            href={`/admin/experiences/${experience.id}/edit`}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              {getStatusBadge(experience.status)}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Title</h3>
                <p className="text-gray-900">{experience.title}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Short Description</h3>
                <p className="text-gray-900">{experience.short_description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Category</h3>
                <p className="text-gray-900">{experience.category}</p>
              </div>

              {experience.vendor && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Vendor</h3>
                  <p className="text-gray-900">{experience.vendor.name}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Location</h3>
                <p className="text-gray-900">{experience.location || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Price</h3>
                <p className="text-gray-900">{experience.currency} {experience.starting_price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Full Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{experience.long_description}</p>
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          {((experience.inclusions && experience.inclusions.length > 0) || (experience.exclusions && experience.exclusions.length > 0)) && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experience.inclusions && experience.inclusions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-green-700 mb-2">Included</h3>
                    <ul className="space-y-1">
                      {experience.inclusions.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {experience.exclusions && experience.exclusions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-red-700 mb-2">Not Included</h3>
                    <ul className="space-y-1">
                      {experience.exclusions.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0">×</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          {experience.featured_image && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
              <img
                src={experience.featured_image}
                alt={experience.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Key Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Details</h3>
            <div className="space-y-3">
              {experience.duration_hours && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="text-gray-900">{experience.duration_hours} hours</span>
                </div>
              )}
              
              {experience.max_participants && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Participants</span>
                  <span className="text-gray-900">{experience.max_participants}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Rating</span>
                <span className="text-gray-900">{experience.rating.toFixed(1)} ★</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Total Bookings</span>
                <span className="text-gray-900">{experience.total_bookings}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Featured</span>
                <span className="text-gray-900">{experience.is_featured ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {experience.tags && experience.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {experience.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 