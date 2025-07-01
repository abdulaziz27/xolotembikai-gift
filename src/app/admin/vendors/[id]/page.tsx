"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Edit3, Trash2, ExternalLink, Mail, Phone, MapPin, Building, Calendar, DollarSign, Activity } from "lucide-react"
import { vendorService } from "@/lib/services/vendors"
import { useToast } from "@/components/ui/toast"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import type { Vendor } from "@/types"

interface VendorDetailPageProps {
  params: Promise<{ id: string }>
}

export default function VendorDetailPage({ params }: VendorDetailPageProps) {
  const router = useRouter()
  const { showToast } = useToast()
  
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [vendorId, setVendorId] = useState<string | null>(null)

  useEffect(() => {
    const initializeVendor = async () => {
      try {
        const resolvedParams = await params
        setVendorId(resolvedParams.id)
        await fetchVendor(resolvedParams.id)
      } catch (error) {
        console.error("Failed to resolve params:", error)
        showToast("Failed to load vendor", "error")
        router.push("/admin/vendors")
      }
    }
    
    initializeVendor()
  }, [params])

  const fetchVendor = async (id: string) => {
    try {
      setLoading(true)
      const vendorData = await vendorService.getVendorById(id)
      setVendor(vendorData)
    } catch (error) {
      console.error("Failed to fetch vendor:", error)
      showToast("Failed to load vendor details", "error")
      router.push("/admin/vendors")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!vendor) return

    setDeleting(true)
    try {
      await vendorService.deleteVendor(vendor.id)
      showToast("Vendor deleted successfully", "success")
      router.push("/admin/vendors")
    } catch (error) {
      console.error("Failed to delete vendor:", error)
      showToast(
        error instanceof Error ? error.message : "Failed to delete vendor",
        "error"
      )
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl border p-6">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Vendor not found</h2>
        <p className="text-gray-600 mb-4">The vendor you're looking for doesn't exist.</p>
        <Link href="/admin/vendors" className="text-blue-600 hover:text-blue-700">
          Back to Vendors
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/vendors"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Vendors
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {vendor.logo_url && (
            <img
              src={vendor.logo_url}
              alt={vendor.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{vendor.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600">{vendor.total_experiences || 0} experiences</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {vendor.website_url && (
            <a
              href={vendor.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Website
            </a>
          )}
          <Link
            href={`/admin/vendors/${vendorId}/edit`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title="Delete Vendor"
        message="Are you sure you want to delete this vendor? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isLoading={deleting}
      />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            {vendor.description ? (
              <p className="text-gray-700 whitespace-pre-wrap">{vendor.description}</p>
            ) : (
              <p className="text-gray-500 italic">No description provided</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:text-blue-700">
                    {vendor.email}
                  </a>
                </div>
              </div>
              
              {vendor.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <a href={`tel:${vendor.phone}`} className="text-blue-600 hover:text-blue-700">
                      {vendor.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {vendor.contact_person && (
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Contact Person</p>
                    <p className="text-gray-700">{vendor.contact_person}</p>
                  </div>
                </div>
              )}
              
              {vendor.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-gray-700">{vendor.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Experiences</span>
                <span className="font-semibold">{vendor.total_experiences || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Commission Rate</span>
                <span className="font-semibold">{vendor.commission_rate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Integration Type</span>
                <span className="font-semibold capitalize">{vendor.api_integration_type}</span>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Business Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Commission</p>
                  <p className="text-sm text-gray-600">{vendor.commission_rate}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Integration</p>
                  <p className="text-sm text-gray-600 capitalize">{vendor.api_integration_type}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Metadata</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Created</p>
                  <p className="text-gray-600">
                    {new Date(vendor.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Last Updated</p>
                  <p className="text-gray-600">
                    {new Date(vendor.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 