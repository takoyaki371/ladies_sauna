import api from './api';

interface Sauna {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  description?: string;
  priceRange?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SaunaSearchParams {
  lat?: number;
  lng?: number;
  radius?: number;
  hasLadiesDay?: boolean;
  facilities?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

export interface SaunaListResponse {
  saunas: (Sauna & { distance?: number })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateSaunaData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  description?: string;
  priceRange: string;
  facilities?: Array<{
    name: string;
    category: string;
    temperature?: number;
    description?: string;
    isWomenOnly?: boolean;
  }>;
}

export const saunaService = {
  async getSaunas(params: SaunaSearchParams = {}): Promise<SaunaListResponse> {
    const response = await api.get('/saunas', { params });
    return response.data;
  },

  async getSauna(id: string): Promise<Sauna & { isFavorited: boolean }> {
    const response = await api.get(`/saunas/${id}`);
    return response.data;
  },

  async createSauna(data: CreateSaunaData): Promise<{ sauna: Sauna; message: string }> {
    const response = await api.post('/saunas', data);
    return response.data;
  },

  async toggleFavorite(saunaId: string): Promise<{ isFavorited: boolean; message: string }> {
    const response = await api.post(`/saunas/${saunaId}/favorite`);
    return response.data;
  },

  async searchNearby(lat: number, lng: number, radius = 5): Promise<SaunaListResponse> {
    return this.getSaunas({ lat, lng, radius });
  },

  async searchWithLadiesDay(): Promise<SaunaListResponse> {
    return this.getSaunas({ hasLadiesDay: true });
  }
};