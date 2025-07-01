"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { vendorService } from "@/lib/services/vendors"
import type { Vendor } from "@/types"
import { useToast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import FileUploader from "@/components/admin/file-uploader"

interface VendorEditPageProps {
  params: Promise<{ id: string }>
}

export default function VendorEditPage({ params }: VendorEditPageProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<Vendor>({
    id: "",
    name: "",
    description: "",
    email: "",
    phone: "",
    website_url: "",
    address: "",
    logo_url: "",
    status: "pending",
    commission_rate: 0,
    api_integration_type: "manual",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true
  })

  useEffect(() => {
    const initializeVendor = async () => {
      try {
        const resolvedParams = await params
        const vendorData = await vendorService.getVendorById(resolvedParams.id)
        setFormData(vendorData)
      } catch (error) {
        console.error("Failed to fetch vendor:", error)
        addToast({ type: "error", title: "Failed to load vendor data" })
        router.push("/admin/vendors")
      } finally {
        setLoading(false)
      }
    }

    initializeVendor()
  }, [params, addToast, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)

      let logoUrl = formData.logo_url

      if (logoFile) {
        // Handle logo upload
        // This is just a placeholder - implement actual upload logic
        logoUrl = formData.logo_url
      }

      const resolvedParams = await params
      await vendorService.updateVendor(resolvedParams.id, {
        ...formData,
        logo_url: logoUrl
      })

      addToast({ type: "success", title: "Vendor updated successfully" })
      router.push("/admin/vendors")
    } catch (error) {
      console.error("Failed to update vendor:", error)
      addToast({ 
        type: "error", 
        title: error instanceof Error ? error.message : "Failed to update vendor" 
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Vendor</h1>
        <p className="text-gray-600 mt-1">
          Update vendor information and settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                name="website_url"
                type="url"
                value={formData.website_url || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Logo</h2>
          <div className="space-y-4">
            {formData.logo_url && (
              <div className="w-32 h-32 relative">
                <img
                  src={formData.logo_url}
                  alt="Vendor logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
            <FileUploader
              onUploadComplete={(url) => {
                setFormData(prev => ({ ...prev, logo_url: url }))
                setLogoFile(null)
              }}
              onError={(error) => {
                addToast({ type: "error", title: error.message })
              }}
              bucket="vendor-logos"
              acceptedFileTypes="image/*"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Vendor["status"] }))}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="commission_rate">Commission Rate (%)</Label>
              <Input
                id="commission_rate"
                name="commission_rate"
                type="number"
                min="0"
                max="100"
                value={formData.commission_rate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="api_integration_type">Integration Type</Label>
              <Select
                value={formData.api_integration_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, api_integration_type: value as Vendor["api_integration_type"] }))}
              >
                <option value="manual">Manual</option>
                <option value="api">API Integration</option>
              </Select>
            </div>
          </div>

          {/* API Credentials */}
          {formData.api_integration_type === "api" && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">API Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="api_endpoint">API Endpoint</Label>
                  <Input
                    id="api_endpoint"
                    name="api_credentials.endpoint"
                    value={formData.api_credentials?.endpoint || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="api_key">API Key</Label>
                  <Input
                    id="api_key"
                    name="api_credentials.api_key"
                    type="password"
                    value={formData.api_credentials?.api_key || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="webhook_url">Webhook URL</Label>
                  <Input
                    id="webhook_url"
                    name="api_credentials.webhook_url"
                    value={formData.api_credentials?.webhook_url || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/vendors")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
} 