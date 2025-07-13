import { useState, useEffect } from 'react';
import { saunaService } from '../services/sauna';

interface SaunaSearchParams {
  lat?: number;
  lng?: number;
  radius?: number;
  hasLadiesDay?: boolean;
  facilities?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

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

export const useSaunas = (searchParams: SaunaSearchParams = {}) => {
  const [saunas, setSaunas] = useState<(Sauna & { distance?: number })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const fetchSaunas = async (params: SaunaSearchParams = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await saunaService.getSaunas({ ...searchParams, ...params });
      setSaunas(response.saunas);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch saunas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSaunas();
  }, []);

  const searchSaunas = (params: SaunaSearchParams) => {
    fetchSaunas(params);
  };

  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      fetchSaunas({ page: pagination.page + 1 });
    }
  };

  return {
    saunas,
    isLoading,
    error,
    pagination,
    searchSaunas,
    loadMore,
    refetch: () => fetchSaunas()
  };
};

export const useSauna = (id: string) => {
  const [sauna, setSauna] = useState<(Sauna & { isFavorited: boolean }) | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSauna = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await saunaService.getSauna(id);
      setSauna(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sauna');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!sauna) return;
    
    try {
      const response = await saunaService.toggleFavorite(id);
      setSauna(prev => prev ? { ...prev, isFavorited: response.isFavorited } : null);
      return response;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to toggle favorite');
    }
  };

  useEffect(() => {
    fetchSauna();
  }, [id]);

  return {
    sauna,
    isLoading,
    error,
    toggleFavorite,
    refetch: fetchSauna
  };
};