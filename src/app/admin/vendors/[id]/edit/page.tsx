"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, X, Upload, Image as ImageIcon } from "lucide-react"
import { vendorService } from "@/lib/services/vendors"
import { useToast } from "@/components/ui/toast"
import type { Vendor, UpdateVendorData, VendorFormData } from "@/types"
import { createClient } from "@/lib/supabase/client"

interface EditVendorPageProps {
  params: Promise<{ id: string }>
}

export default function EditVendorPage({ params }: EditVendorPageProps) {
  const router = useRouter()
  const { addToast } = useToast()
  
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [formData, setFormData] = useState<VendorFormData>({
    name: "",
    email: "",
    description: "",
    logo_url: "",
    website_url: "",
    contact_person: "",
    phone: "",
    address: "",
    api_integration_type: "manual",
    commission_rate: 10.00,
    status: "active",
    is_active: true
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [vendorId, setVendorId] = useState<string | null>(null)

  // Initialize vendor data
  useEffect(() => {
    const initializeVendor = async () => {
      try {
        const resolvedParams = await params
        const id = resolvedParams.id
        setVendorId(id)
        
        const vendorData = await vendorService.getVendorById(id)
        setVendor(vendorData)
        
        setFormData({
          name: vendorData.name,
          email: vendorData.email,
          description: vendorData.description || "",
          logo_url: vendorData.logo_url || "",
          website_url: vendorData.website_url || "",
          contact_person: vendorData.contact_person || "",
          phone: vendorData.phone || "",
          address: vendorData.address || "",
          api_integration_type: vendorData.api_integration_type,
          commission_rate: vendorData.commission_rate,
          status: vendorData.status,
          is_active: vendorData.is_active
        })
        
        if (vendorData.logo_url) {
          setLogoPreview(vendorData.logo_url)
        }
      } catch (error) {
        console.error("Failed to fetch vendor:", error)
        addToast({ type: "error", title: "Failed to load vendor data" })
        router.push("/admin/vendors")
      } finally {
        setLoading(false)
      }
    }
    
    initializeVendor()
  }, [params])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'commission_rate' ? parseFloat(value) || 0 : value)
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        addToast({ type: "error", title: "Please select a valid image file" })
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        addToast({ type: "error", title: "Image size must be less than 5MB" })
        return
      }
      
      setLogoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadLogo = async (file: File): Promise<string> => {
    try {
      const supabase = createClient()
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      // Upload file to storage
      const { data, error } = await supabase.storage
        .from('vendor-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Storage upload error:', error)
        throw new Error(`Upload failed: ${error.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vendor-logos')
        .getPublicUrl(data.path)

      addToast({ type: "success", title: "Logo uploaded successfully!" })
      return publicUrl
      
    } catch (error) {
      console.error('Logo upload error:', error)
      addToast({ type: "error", title: error instanceof Error ? error.message : "Failed to upload logo" })
      throw error
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Vendor name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.commission_rate < 0 || formData.commission_rate > 100) {
      newErrors.commission_rate = "Commission rate must be between 0 and 100"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      addToast({ type: "error", title: "Please fix the errors below" })
      return
    }

    setSaving(true)
    try {
      let logoUrl = formData.logo_url

      // Upload logo if a new file was selected
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile)
      }

      const updateData = {
        ...formData,
        logo_url: logoUrl
      }

      await vendorService.updateVendor(formData.id, updateData)
      addToast({ type: "success", title: "Vendor updated successfully" })
      router.push(`/admin/vendors/${formData.id}`)
    } catch (error) {
      console.error("Error updating vendor:", error)
      addToast({ type: "error", title: error instanceof Error ? error.message : "Failed to update vendor" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="bg-white rounded-xl border p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/vendors/${vendorId}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Vendor
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Vendor</h1>
          <p className="text-gray-600 mt-1">Update vendor information and settings</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter vendor name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter vendor description"
              />
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Logo</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Logo
                </label>
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="logo"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </label>
                  <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  {logoFile && (
                    <span className="text-sm text-gray-600">{logoFile.name}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB. Recommended size: 200x200px
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                id="contact_person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter contact person name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label htmlFor="website_url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                id="website_url"
                name="website_url"
                value={formData.website_url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full address"
              />
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Business Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="commission_rate" className="block text-sm font-medium text-gray-700 mb-2">
                Commission Rate (%)
              </label>
              <input
                type="number"
                id="commission_rate"
                name="commission_rate"
                value={formData.commission_rate}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.commission_rate ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10.00"
              />
              {errors.commission_rate && <p className="text-red-500 text-sm mt-1">{errors.commission_rate}</p>}
            </div>

            <div>
              <label htmlFor="api_integration_type" className="block text-sm font-medium text-gray-700 mb-2">
                Integration Type
              </label>
              <select
                id="api_integration_type"
                name="api_integration_type"
                value={formData.api_integration_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="manual">Manual</option>
                <option value="api">API Integration</option>
              </select>
            </div>

                         <div>
               <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                 Status
               </label>
               <select
                 id="status"
                 name="status"
                 value={formData.status}
                 onChange={handleInputChange}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               >
                 <option value="pending">Pending</option>
                 <option value="active">Active</option>
                 <option value="inactive">Inactive</option>
                 <option value="rejected">Rejected</option>
               </select>
             </div>

             <div className="flex items-center">
               <input
                 type="checkbox"
                 id="is_active"
                 name="is_active"
                 checked={formData.is_active}
                 onChange={handleInputChange}
                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
               />
               <label htmlFor="is_active" className="ml-2 block text-sm font-medium text-gray-700">
                 Active Vendor
               </label>
             </div>
           </div>
         </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            href={`/admin/vendors/${vendorId}`}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
} 