"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { ExperiencesTable } from "./components/experiences-table"

interface Experience {
  id: string
  title: string
  slug: string
  price: number
  featured_image: string
  status: 'active' | 'inactive' | 'draft'
  created_at: string
  vendor_name?: string
}

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
          price: exp.starting_price || exp.price || 0,
          featured_image: exp.featured_image,
          status: exp.status,
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