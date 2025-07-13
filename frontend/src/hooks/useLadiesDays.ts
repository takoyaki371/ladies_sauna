import { useState, useEffect } from 'react';
import { ladiesDayService } from '../services/ladiesDay';

interface LadiesDayWithSauna {
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

export const useTodaysLadiesDays = () => {
  const [ladiesDays, setLadiesDays] = useState<LadiesDayWithSauna[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dayInfo, setDayInfo] = useState<{ date: string; dayOfWeek: number } | null>(null);

  const fetchTodaysLadiesDays = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ladiesDayService.getTodaysLadiesDays();
      setLadiesDays(response.ladiesDays);
      setDayInfo({ date: response.date, dayOfWeek: response.dayOfWeek });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch today\'s ladies days');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysLadiesDays();
  }, []);

  return {
    ladiesDays,
    dayInfo,
    isLoading,
    error,
    refetch: fetchTodaysLadiesDays
  };
};

export const useLadiesDaysForSauna = (saunaId: string) => {
  const [ladiesDays, setLadiesDays] = useState<LadiesDayWithSauna[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLadiesDays = async () => {
    if (!saunaId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await ladiesDayService.getLadiesDaysForSauna(saunaId);
      setLadiesDays(response.ladiesDays);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch ladies days');
    } finally {
      setIsLoading(false);
    }
  };

  const vote = async (ladiesDayId: string, voteType: 'SUPPORT' | 'OPPOSE') => {
    try {
      const response = await ladiesDayService.voteLadiesDay(ladiesDayId, { voteType });
      
      // Update the local state
      setLadiesDays(prev => prev.map(ld => 
        ld.id === ladiesDayId 
          ? { 
              ...ld, 
              supportCount: response.supportCount,
              oppositionCount: response.oppositionCount,
              trustScore: response.trustScore
            }
          : ld
      ));
      
      return response;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to vote');
    }
  };

  const createLadiesDay = async (data: {
    dayOfWeek?: number;
    specificDate?: string;
    startTime?: string;
    endTime?: string;
    isOfficial?: boolean;
  }) => {
    try {
      const response = await ladiesDayService.createLadiesDay({
        saunaId,
        sourceType: 'USER',
        ...data
      });
      
      // Refresh the list
      await fetchLadiesDays();
      
      return response;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create ladies day');
    }
  };

  useEffect(() => {
    fetchLadiesDays();
  }, [saunaId]);

  return {
    ladiesDays,
    isLoading,
    error,
    vote,
    createLadiesDay,
    refetch: fetchLadiesDays
  };
};