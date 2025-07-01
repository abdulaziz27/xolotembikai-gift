import { Experience, ExperienceForm, ExperienceListResponse, FilterOptions } from '@/types/experiences';

export const experienceService = {
  // Get list of experiences with filters and pagination
  async getExperiences(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    occasions?: string[];
    sortBy?: string;
    status?: string;
  } = {}): Promise<ExperienceListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.category) searchParams.set('category', params.category);
    if (params.priceMin) searchParams.set('priceMin', params.priceMin.toString());
    if (params.priceMax) searchParams.set('priceMax', params.priceMax.toString());
    if (params.occasions?.length) searchParams.set('occasions', params.occasions.join(','));
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.status) searchParams.set('status', params.status);

    const response = await fetch(`/api/experiences?${searchParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch experiences');
    }

    return response.json();
  },

  // Get single experience by slug
  async getExperienceBySlug(slug: string): Promise<Experience> {
    const response = await fetch(`/api/experiences/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Experience not found');
      }
      throw new Error('Failed to fetch experience');
    }

    return response.json();
  },

  // Get single experience by ID
  async getExperienceById(id: string): Promise<Experience> {
    const response = await fetch(`/api/experiences/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Experience not found');
      }
      throw new Error('Failed to fetch experience');
    }

    return response.json();
  },

  // Get filter options with counts
  async getFilterOptions(): Promise<FilterOptions> {
    const response = await fetch('/api/experiences/filters');
    
    if (!response.ok) {
      throw new Error('Failed to fetch filter options');
    }

    return response.json();
  },

  // Admin: Create new experience
  async createExperience(data: ExperienceForm): Promise<Experience> {
    const response = await fetch('/api/experiences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create experience');
    }

    return response.json();
  },

  // Admin: Update experience (can use slug or ID)
  async updateExperience(slugOrId: string, data: Partial<ExperienceForm>): Promise<Experience> {
    const response = await fetch(`/api/experiences/${slugOrId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update experience');
    }

    return response.json();
  },

  // Admin: Delete experience (can use slug or ID)
  async deleteExperience(slugOrId: string): Promise<void> {
    const response = await fetch(`/api/experiences/${slugOrId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete experience');
    }
  },

  // Bulk delete experiences
  async bulkDeleteExperiences(slugsOrIds: string[]): Promise<void> {
    await Promise.all(slugsOrIds.map(slugOrId => this.deleteExperience(slugOrId)));
  },

  // Get experiences for frontend (only active)
  async getFrontendExperiences(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    occasions?: string[];
    sortBy?: string;
  } = {}): Promise<ExperienceListResponse> {
    return this.getExperiences({
      ...params,
      status: 'active'
    });
  }
};

// Export commonly used functions
export const getAllExperiences = (params?: any) => experienceService.getExperiences(params);
export const getExperienceById = (id: string) => experienceService.getExperienceById(id);
export const getExperienceBySlug = (slug: string) => experienceService.getExperienceBySlug(slug);
export const createExperience = (data: ExperienceForm) => experienceService.createExperience(data);
export const updateExperience = (slugOrId: string, data: Partial<ExperienceForm>) => experienceService.updateExperience(slugOrId, data);
export const deleteExperience = (slugOrId: string) => experienceService.deleteExperience(slugOrId);

// Utility functions for frontend
export const experienceUtils = {
  // Format price with currency
  formatPrice(price: number, currency: string): string {
    const currencyMap: Record<string, string> = {
      'USD': '$',
      'MYR': 'RM',
      'SGD': 'S$',
      'GBP': '£',
      'EUR': '€'
    };

    const symbol = currencyMap[currency] || currency;
    return `${symbol}${price.toFixed(2)}`;
  },

  // Get badge color for category
  getCategoryColor(category: string): string {
    const colorMap: Record<string, string> = {
      'Wellness': 'bg-green-100 text-green-800',
      'Food': 'bg-orange-100 text-orange-800',
      'Adventure': 'bg-red-100 text-red-800',
      'Technology': 'bg-blue-100 text-blue-800',
      'Arts': 'bg-purple-100 text-purple-800',
      'Fashion': 'bg-pink-100 text-pink-800',
      'Sports': 'bg-yellow-100 text-yellow-800',
      'Education': 'bg-indigo-100 text-indigo-800',
      'Entertainment': 'bg-gray-100 text-gray-800',
      'Travel': 'bg-cyan-100 text-cyan-800'
    };

    return colorMap[category] || 'bg-gray-100 text-gray-800';
  },

  // Get action button text based on category
  getActionButtonText(category: string): string {
    const giftCardCategories = ['Technology', 'Food', 'Fashion'];
    return giftCardCategories.includes(category) ? 'Get Gift Card' : 'Book Experience';
  },

  // Generate SEO-friendly slug
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100);
  },

  // Calculate discount percentage
  calculateDiscount(originalPrice: number, discountedPrice: number): number {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  },

  // Format rating display
  formatRating(rating: number): string {
    return rating.toFixed(1);
  },

  // Get experience type for detail page
  getExperienceType(category: string): 'gift-card' | 'booking' {
    const giftCardCategories = ['Technology', 'Food', 'Fashion'];
    return giftCardCategories.includes(category) ? 'gift-card' : 'booking';
  }
}; 