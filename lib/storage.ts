import { UserProgress } from './types';

const STORAGE_KEY = 'operdle-progress';

export function getUserProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return {
      completedDates: [],
      results: {}
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load user progress:', error);
  }

  return {
    completedDates: [],
    results: {}
  };
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save user progress:', error);
  }
}

export function markDateCompleted(date: string, submittedSolution: string[], isCorrect: boolean): void {
  const progress = getUserProgress();
  
  // Only add to completedDates if the answer was correct
  if (isCorrect && !progress.completedDates.includes(date)) {
    progress.completedDates.push(date);
  }
  
  progress.results[date] = {
    completed: isCorrect, // Only mark as completed if correct
    attempts: 1, // Always 1 since users only get one attempt now
    solvedAt: new Date().toISOString(),
    submittedSolution,
    isCorrect
  };
  
  saveUserProgress(progress);
}

export function isDateCompleted(date: string): boolean {
  const progress = getUserProgress();
  return progress.completedDates.includes(date);
}

export function getDateResult(date: string) {
  const progress = getUserProgress();
  return progress.results[date] || null;
}

export function getCompletedDatesCount(): number {
  const progress = getUserProgress();
  return progress.completedDates.length;
}

export function clearAllProgress(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear progress:', error);
  }
}

// Export for debugging/development
export function exportProgress(): string {
  const progress = getUserProgress();
  return JSON.stringify(progress, null, 2);
}

export function importProgress(progressData: string): boolean {
  try {
    const progress = JSON.parse(progressData) as UserProgress;
    
    // Validate the structure
    if (typeof progress.completedDates !== 'object' || !Array.isArray(progress.completedDates)) {
      throw new Error('Invalid progress data format');
    }
    
    if (typeof progress.results !== 'object' || progress.results === null) {
      throw new Error('Invalid results data format');
    }
    
    saveUserProgress(progress);
    return true;
  } catch (error) {
    console.error('Failed to import progress:', error);
    return false;
  }
}
