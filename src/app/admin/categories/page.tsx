"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { CategoriesTable } from "./components/categories-table"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  status: 'active' | 'inactive'
  total_experiences: number
  created_at: string
  updated_at: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
        const data = await response.json()

      if (response.ok) {
        setCategories(data.categories || data || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-gray-600 mt-1">
            Organize experiences into meaningful categories
          </p>
        </div>
        <Link
          href="/admin/categories/create"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Link>
      </div>

      <CategoriesTable 
        data={categories}
        loading={loading}
        onRefresh={fetchCategories}
      />
    </div>
  )
} 