"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"
import VendorsTable from "./components/vendors-table"
import { vendorService } from "@/lib/services/vendors"
import { useToast } from "@/components/ui/toast"
import type { Vendor } from "@/types"

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  const fetchVendors = async () => {
    try {
      const data = await vendorService.getAllVendors()
      setVendors(data)
    } catch (error) {
      console.error("Failed to fetch vendors:", error)
      addToast({ type: "error", title: "Failed to fetch vendors" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="text-gray-600 mt-1">
            Manage your experience providers
          </p>
        </div>
        <Link
          href="/admin/vendors/create"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </Link>
      </div>

      <VendorsTable
        data={vendors}
        loading={loading}
        onRefresh={fetchVendors}
      />
    </div>
  )
} 