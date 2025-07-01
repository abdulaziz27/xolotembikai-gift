// Main types export
export * from './auth'
export * from './experiences'
export * from './vendors'

// Common types
export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface NavItem {
  name: string
  href: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          published: boolean
          created_at: string
          updated_at: string
          author_id: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          published?: boolean
          created_at?: string
          updated_at?: string
          author_id: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          published?: boolean
          created_at?: string
          updated_at?: string
          author_id?: string
        }
      }
      experiences: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          price: number
          published: boolean
          created_at: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          price: number
          published?: boolean
          created_at?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          price?: number
          published?: boolean
          created_at?: string
          updated_at?: string
          vendor_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Vendor types
export interface Vendor {
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
  api_integration_type?: 'manual' | 'api'
  api_credentials?: Record<string, any>
  commission_rate?: number
  status?: 'pending' | 'active' | 'inactive' | 'rejected'
  is_active?: boolean
}

export interface UpdateVendorData extends Partial<CreateVendorData> {
  id: string
} 