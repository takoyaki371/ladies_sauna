import api from './api';

export interface LadiesDayWithSauna {
  id: string;
  saunaId: string;
  dayOfWeek?: number;
  specificDate?: string;
  startTime?: string;
  endTime?: string;
  isOfficial: boolean;
  sourceType: string;
  sourceUserId?: string;
  trustScore: number;
  supportCount: number;
  oppositionCount: number;
  createdAt: string;
  updatedAt: string;
  sauna: {
    id: string;
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
    priceRange?: string;
    rating?: number;
  };
  sourceUser?: {
    username: string;
    trustScore: number;
  };
}

export interface CreateLadiesDayData {
  saunaId: string;
  dayOfWeek?: number | null;
  specificDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  isOfficial: boolean;
  sourceType: 'USER' | 'OFFICIAL';
}

export const ladiesDayService = {
  async getTodaysLadiesDays() {
    const response = await api.get('/ladies-days/today');
    return response.data;
  },

  async getLadiesDays(params?: any) {
    const response = await api.get('/ladies-days', { params });
    return response.data;
  },

  async getLadiesDaysForSauna(saunaId: string) {
    return this.getLadiesDays({ saunaId });
  },

  async createLadiesDay(data: CreateLadiesDayData) {
    const response = await api.post('/ladies-days', data);
    return response.data;
  },

  async voteLadiesDay(id: string, voteData: any) {
    const response = await api.post(`/ladies-days/${id}/vote`, voteData);
    return response.data;
  }
};