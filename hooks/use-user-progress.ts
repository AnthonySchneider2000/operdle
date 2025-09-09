'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserProgress } from '@/lib/types';
import { getUserProgress, markDateCompleted, isDateCompleted, getDateResult } from '@/lib/storage';

export function useUserProgress() {
  return useQuery({
    queryKey: ['userProgress'],
    queryFn: getUserProgress,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useMarkDateCompleted() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ date, submittedSolution, isCorrect }: { 
      date: string; 
      submittedSolution: string[]; 
      isCorrect: boolean; 
    }) => {
      markDateCompleted(date, submittedSolution, isCorrect);
      return Promise.resolve();
    },
    onSuccess: () => {
      // Invalidate user progress to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    },
  });
}

export function useDateCompletion(date: string) {
  const { data: progress } = useUserProgress();
  
  return {
    isCompleted: progress?.completedDates.includes(date) || false,
    result: progress?.results[date] || null
  };
}

export function useCompletionStats() {
  const { data: progress } = useUserProgress();
  
  if (!progress) {
    return {
      totalCompleted: 0,
      totalAttempts: 0,
      averageAttempts: 0,
      completionRate: 0
    };
  }
  
  const totalCompleted = progress.completedDates.length;
  const results = Object.values(progress.results);
  const totalAttempts = results.reduce((sum, result) => sum + (result.attempts || 0), 0);
  const averageAttempts = totalCompleted > 0 ? totalAttempts / totalCompleted : 0;
  
  // Calculate completion rate based on available days (assuming game started Jan 1, 2024)
  const today = new Date();
  const gameStart = new Date('2024-01-01');
  const daysSinceStart = Math.floor((today.getTime() - gameStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const completionRate = totalCompleted / daysSinceStart;
  
  return {
    totalCompleted,
    totalAttempts,
    averageAttempts: Math.round(averageAttempts * 100) / 100,
    completionRate: Math.round(completionRate * 100) / 100
  };
}

// Custom hook for syncing local storage changes across tabs
export function useStorageSync() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'operdle-progress') {
        // Invalidate user progress when storage changes in another tab
        queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [queryClient]);
}
