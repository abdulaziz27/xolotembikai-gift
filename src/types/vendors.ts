// Vendor types
export interface Vendor {
  [key: string]: string | number | boolean | undefined | Record<string, any> | string[]
  id: string
  name: string
  email: string
  description?: string
  logo_url?: string
  website_url?: string
  contact_person?: string
  phone?: string
  address?: string
  api_integration_type: 'manual' | 'api'
  api_credentials?: Record<string, any>
  commission_rate: number
  status: 'pending' | 'active' | 'inactive' | 'rejected'
  is_active: boolean
  created_at: string
  updated_at: string
  total_experiences?: number
}

export interface CreateVendorData {
  name: string
  email: string
  description?: string
  logo_url?: string
  website_url?: string
  contact_person?: string
  phone?: string
  address?: string
  api_integration_type: 'manual' | 'api'
  api_credentials?: Record<string, any>
  commission_rate: number
  status: 'pending' | 'active' | 'inactive' | 'rejected'
  is_active: boolean
}

export interface UpdateVendorData extends Partial<CreateVendorData> {
  id: string
}

export interface VendorFormData {
  id?: string
  name: string
  email: string
  description: string
  logo_url: string
  website_url: string
  contact_person: string
  phone: string
  address: string
  api_integration_type: 'manual' | 'api'
  commission_rate: number
  status: 'pending' | 'active' | 'inactive' | 'rejected'
  is_active: boolean
} 