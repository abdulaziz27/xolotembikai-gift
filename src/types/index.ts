// Main types export
export * from "./auth";
export * from "./experiences";
export * from "./vendors";
export * from "./orders";

// Common types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface NavItem {
  name: string;
  href: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: "user" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          published: boolean;
          created_at: string;
          updated_at: string;
          author_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
          author_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
          author_id?: string;
        };
      };
      experiences: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          price: number;
          published: boolean;
          created_at: string;
          updated_at: string;
          vendor_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          price: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
          vendor_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          price?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
          vendor_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Vendor types
export interface Vendor extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  email: string;
  phone?: string;
  website_url?: string;
  address?: string;
  logo_url?: string;
  status: "active" | "pending" | "inactive";
  commission_rate: number;
  api_integration_type: "api" | "manual";
  api_credentials?: {
    endpoint?: string;
    api_key?: string;
    webhook_url?: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  total_experiences?: number;
  contact_person?: string;
}

export interface CreateVendorData extends Record<string, unknown> {
  name: string;
  description: string;
  email: string;
  phone?: string;
  website_url?: string;
  address?: string;
  logo_url?: string;
  status: "active" | "pending" | "inactive";
  commission_rate: number;
  api_integration_type: "api" | "manual";
  api_credentials?: {
    endpoint?: string;
    api_key?: string;
    webhook_url?: string;
  };
  is_active: boolean;
  contact_person?: string;
}

export interface UpdateVendorData extends Record<string, unknown> {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  website_url?: string;
  address?: string;
  logo_url?: string;
  status?: "active" | "pending" | "inactive";
  commission_rate?: number;
  api_integration_type?: "api" | "manual";
  api_credentials?: {
    endpoint?: string;
    api_key?: string;
    webhook_url?: string;
  };
  is_active?: boolean;
  contact_person?: string;
}

export interface Category extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  total_experiences?: number;
  slug?: string;
  status?: "active" | "inactive";
}
