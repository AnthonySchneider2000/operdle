'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { GameBoard } from '@/components/game/GameBoard';
import { GameCalendar } from '@/components/game/GameCalendar';
import { Separator } from '@/components/ui/separator';
import { useGameData } from '@/hooks/use-game-data';
import { useMarkDateCompleted, useDateCompletion, useStorageSync } from '@/hooks/use-user-progress';
import { Target } from 'lucide-react';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Sync storage changes across tabs
  useStorageSync();
  
  const { data: gameData, isLoading } = useGameData(selectedDate);
  const markCompleted = useMarkDateCompleted();
  
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const { result } = useDateCompletion(selectedDateString);

  const handleGameComplete = (isCorrect: boolean, submittedSolution: string[]) => {
    markCompleted.mutate({
      date: selectedDateString,
      submittedSolution,
      isCorrect
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  if (isLoading || !gameData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="min-h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Target className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Operdle</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto pb-4">
            Arrange the mathematical operations in the correct order to transform the input number into the target number.
          </p>
        </div>

        {/* Game Content */}
        <GameBoard
          gameData={gameData}
          onGameComplete={handleGameComplete}
          submittedResult={result}
          isReviewMode={!!result}
        />
      </div>

      {/* Previous Days Section */}
      <div className="pt-12 space-y-6">
        <Separator />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Previous Days</h2>
          <p className="text-muted-foreground">
            Select a previous date to play or review that day&apos;s puzzle
          </p>
        </div>
        
        <GameCalendar
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
          minDate={new Date('2025-09-02')}
          maxDate={new Date()}
        />
      </div>

    </div>
  );
}
