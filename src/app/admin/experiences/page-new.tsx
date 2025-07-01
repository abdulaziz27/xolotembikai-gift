"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { ExperiencesTable } from "./components/experiences-table"
import type { Experience } from "@/types/experiences"

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/experiences')
      const data = await response.json()
      
      if (response.ok) {
        // Transform data to match our table interface
        const transformedData = data.experiences?.map((exp: any) => ({
          id: exp.id,
          title: exp.title,
          slug: exp.slug,
          short_description: exp.short_description,
          long_description: exp.long_description,
          category: exp.category,
          vendor_id: exp.vendor_id,
          occasions: exp.occasions || [],
          starting_price: exp.starting_price || exp.price || 0,
          duration_hours: exp.duration_hours,
          max_participants: exp.max_participants,
          min_participants: exp.min_participants,
          location: exp.location,
          featured_image: exp.featured_image,
          gallery: exp.gallery || [],
          tags: exp.tags || [],
          inclusions: exp.inclusions || [],
          exclusions: exp.exclusions || [],
          requirements: exp.requirements || [],
          cancellation_policy: exp.cancellation_policy,
          status: exp.status,
          is_featured: exp.is_featured || false,
          rating: exp.rating || 0,
          total_reviews: exp.total_reviews || 0,
          total_bookings: exp.total_bookings || 0,
          currency: exp.currency || 'MYR',
          price_options: exp.price_options || {},
          vendor: exp.vendor || undefined,
          created_at: exp.created_at,
          vendor_name: exp.vendor?.name || 'No Vendor'
        })) || []
        
        setExperiences(transformedData)
      }
    } catch (error) {
      console.error('Failed to fetch experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experiences</h1>
          <p className="text-gray-600 mt-1">
            Manage your experience offerings with advanced table features
          </p>
        </div>
        <Link
          href="/admin/experiences/create"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Experience
        </Link>
      </div>

      <ExperiencesTable 
        data={experiences}
        loading={loading}
        onRefresh={fetchExperiences}
      />
    </div>
  )
}