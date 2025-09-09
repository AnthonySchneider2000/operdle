export type OperationType = '+' | '-' | '*' | '/' | 'square' | 'cube' | 'sqrt';

export interface Operation {
  id: string;
  type: OperationType;
  value?: number; // For operations that need a specific value (e.g., +5, *3)
  label: string;
}

export interface GameData {
  date: string;
  inputNumber: number;
  targetNumber: number;
  operations: Operation[];
  solution: string[]; // Array of operation IDs in correct order
}

export interface GameState {
  currentOperations: Operation[];
  isComplete: boolean;
  isCorrect: boolean;
  currentResult: number;
}

export interface UserProgress {
  completedDates: string[];
  results: Record<string, {
    completed: boolean;
    attempts: number;
    solvedAt: string;
    submittedSolution?: string[]; // Array of operation IDs in the order user submitted
    isCorrect?: boolean;
  }>;
}

export interface CalendarDay {
  date: string;
  isCompleted: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}
