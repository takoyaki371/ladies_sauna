import api from './api';

export interface Review {
  id: string;
  saunaId: string;
  userId: string;
  rating: number;
  title: string;
  content: string;
  visitDate: string;
  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    username: string;
  };
  sauna?: {
    id: string;
    name: string;
    address: string;
  };
}

export interface CreateReviewData {
  saunaId: string;
  rating: number;
  title: string;
  content: string;
  visitDate: string;
  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
}

export interface ReviewListResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReviewSearchParams {
  saunaId?: string;
  userId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'rating' | 'visitDate';
  sortOrder?: 'asc' | 'desc';
}

export const reviewService = {
  async getReviews(params: ReviewSearchParams = {}): Promise<ReviewListResponse> {
    const response = await api.get('/reviews', { params });
    return response.data;
  },

  async getReview(id: string): Promise<Review> {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  async createReview(data: CreateReviewData): Promise<{ review: Review; message: string }> {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  async updateReview(id: string, data: Partial<CreateReviewData>): Promise<{ review: Review; message: string }> {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },

  async deleteReview(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  async getSaunaReviews(saunaId: string, params: ReviewSearchParams = {}): Promise<ReviewListResponse> {
    return this.getReviews({ ...params, saunaId });
  },

  async getUserReviews(userId: string, params: ReviewSearchParams = {}): Promise<ReviewListResponse> {
    return this.getReviews({ ...params, userId });
  },

  async getMyReviews(params: ReviewSearchParams = {}): Promise<ReviewListResponse> {
    const response = await api.get('/reviews/my', { params });
    return response.data;
  },

  async likeReview(id: string): Promise<{ isLiked: boolean; likeCount: number; message: string }> {
    const response = await api.post(`/reviews/${id}/like`);
    return response.data;
  }
};