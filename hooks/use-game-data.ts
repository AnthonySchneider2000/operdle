'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { GameData } from '@/lib/types';
import { generateGameData, getTodaysGameData, getGameDataForDate } from '@/lib/game-data';

export function useGameData(date?: Date) {
  return useQuery({
    queryKey: ['gameData', date ? format(date, 'yyyy-MM-dd') : 'today'],
    queryFn: () => {
      if (date) {
        return getGameDataForDate(date);
      }
      return getTodaysGameData();
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - game data doesn't change
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}

export function useTodaysGameData() {
  return useQuery({
    queryKey: ['gameData', 'today'],
    queryFn: getTodaysGameData,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}

export function useHistoricalGameData(dates: string[]) {
  return useQuery({
    queryKey: ['historicalGameData', dates.join(',')],
    queryFn: async () => {
      const gameDataMap: Record<string, GameData> = {};
      
      for (const date of dates) {
        gameDataMap[date] = generateGameData(date);
      }
      
      return gameDataMap;
    },
    enabled: dates.length > 0,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 30, // 30 days for historical data
  });
}
