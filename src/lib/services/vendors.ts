import { createClient } from '@/lib/supabase/client'
import type { Vendor, CreateVendorData, UpdateVendorData } from '@/types'

export class VendorService {
  private supabase = createClient()

  async getAllVendors(): Promise<Vendor[]> {
    try {
      const response = await fetch('/api/vendors')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch vendors')
      }
      
      return Array.isArray(data) ? data : data.vendors || []
    } catch (error) {
      console.error('Error fetching vendors:', error)
      throw error
    }
  }

  async getVendorById(id: string): Promise<Vendor> {
    try {
      const response = await fetch(`/api/vendors/${id}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch vendor')
      }
      
      return data
    } catch (error) {
      console.error('Error fetching vendor by ID:', error)
      throw error
    }
  }

  async createVendor(vendorData: CreateVendorData): Promise<Vendor> {
    try {
      const response = await fetch('/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create vendor')
      }
      
      return data
    } catch (error) {
      console.error('Error creating vendor:', error)
      throw error
    }
  }

  async updateVendor(id: string, vendorData: Partial<CreateVendorData>): Promise<Vendor> {
    try {
      const response = await fetch(`/api/vendors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update vendor')
      }
      
      return data
    } catch (error) {
      console.error('Error updating vendor:', error)
      throw error
    }
  }

  async deleteVendor(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/vendors/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete vendor')
      }
    } catch (error) {
      console.error('Error deleting vendor:', error)
      throw error
    }
  }

  async bulkDeleteVendors(ids: string[]): Promise<void> {
    try {
      const deletePromises = ids.map(id => this.deleteVendor(id))
      await Promise.all(deletePromises)
    } catch (error) {
      console.error('Error bulk deleting vendors:', error)
      throw error
    }
  }
}

export const vendorService = new VendorService() 