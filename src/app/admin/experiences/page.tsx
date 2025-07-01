"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { ExperiencesTable } from "./components/experiences-table"
import { getAllExperiences } from "@/lib/services/experiences"
import type { Experience } from "@/types/experiences"

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const response = await getAllExperiences({ limit: 1000 })
      setExperiences(response.experiences || [])
    } catch (error) {
      console.error('Failed to fetch experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences()
  }, [])

  const stats = {
    total: experiences.length,
    active: experiences.filter(e => e.status === 'active').length,
    draft: experiences.filter(e => e.status === 'draft').length,
    archived: experiences.filter(e => e.status === 'archived').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experiences</h1>
          <p className="text-gray-600 mt-1">
            Manage your experience offerings
          </p>
        </div>
          <Link
            href="/admin/experiences/create"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Experiences</div>
            </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">{stats.draft}</div>
          <div className="text-sm text-gray-600">Draft</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
          <div className="text-sm text-gray-600">Archived</div>
          </div>
      </div>

      <ExperiencesTable 
        data={experiences}
        loading={loading}
        onRefresh={fetchExperiences}
      />
    </div>
  )
} 