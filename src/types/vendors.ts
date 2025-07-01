// Vendor types
export interface Vendor extends Record<string, unknown> {
  id: string
  name: string
  description: string
  email: string
  phone?: string
  website_url?: string
  address?: string
  logo_url?: string
  status: 'active' | 'pending' | 'inactive'
  commission_rate: number
  api_integration_type: 'api' | 'manual'
  api_credentials?: {
    endpoint?: string
    api_key?: string
    webhook_url?: string
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateVendorData extends Record<string, unknown> {
  name: string
  description: string
  email: string
  phone?: string
  website_url?: string
  address?: string
  logo_url?: string
  status: 'active' | 'pending' | 'inactive'
  commission_rate: number
  api_integration_type: 'api' | 'manual'
  api_credentials?: {
    endpoint?: string
    api_key?: string
    webhook_url?: string
  }
  is_active: boolean
}

export interface UpdateVendorData extends Record<string, unknown> {
  name?: string
  description?: string
  email?: string
  phone?: string
  website_url?: string
  address?: string
  logo_url?: string
  status?: 'active' | 'pending' | 'inactive'
  commission_rate?: number
  api_integration_type?: 'api' | 'manual'
  api_credentials?: {
    endpoint?: string
    api_key?: string
    webhook_url?: string
  }
  is_active?: boolean
}

export interface VendorFormData extends Record<string, unknown> {
  id?: string
  name: string
  description: string
  email: string
  phone?: string
  website_url?: string
  address?: string
  logo_url?: string
  status: 'active' | 'pending' | 'inactive'
  commission_rate: number
  api_integration_type: 'api' | 'manual'
  api_credentials?: {
    endpoint?: string
    api_key?: string
    webhook_url?: string
  }
  total_experiences?: number
  created_at?: string
  updated_at?: string
} 