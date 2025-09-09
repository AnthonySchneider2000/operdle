'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { GameBoard } from '@/components/game/GameBoard';
import { GameCalendar } from '@/components/game/GameCalendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useGameData } from '@/hooks/use-game-data';
import { useUserProgress, useMarkDateCompleted, useDateCompletion, useStorageSync } from '@/hooks/use-user-progress';
import { Calendar, Trophy, Target, Clock } from 'lucide-react';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Sync storage changes across tabs
  useStorageSync();
  
  const { data: gameData, isLoading } = useGameData(selectedDate);
  const { data: userProgress } = useUserProgress();
  const markCompleted = useMarkDateCompleted();
  
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const { isCompleted, result } = useDateCompletion(selectedDateString);
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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

        {/* Show correct solution for completed puzzles */}
        {isCompleted && (
          <Card className="p-6 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <div className="text-center space-y-4">
              <Trophy className="h-8 w-8 text-green-600 mx-auto" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                Puzzle Completed Successfully!
              </h3>
              <p className="text-green-700 dark:text-green-300">
                Solved on {result?.solvedAt ? format(new Date(result.solvedAt), 'MMMM d, yyyy') : 'a previous date'}.
              </p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Correct Solution:
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <Badge variant="outline">{gameData.inputNumber}</Badge>
                  {gameData.solution.map((operationId, index) => {
                    const operation = gameData.operations.find(op => op.id === operationId);
                    return operation ? (
                      <div key={operationId} className="flex items-center gap-2">
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="secondary">{operation.label}</Badge>
                      </div>
                    ) : null;
                  })}
                  <span className="text-muted-foreground">→</span>
                  <Badge variant="outline">{gameData.targetNumber}</Badge>
                </div>
              </div>
            </div>
          </Card>
        )}

      </div>

      {/* Previous Days Section */}
      <div className="pt-12 space-y-6">
        <Separator />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Previous Days</h2>
          <p className="text-muted-foreground">
            Select a previous date to play or review that day's puzzle
          </p>
        </div>
        
        <GameCalendar
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
          minDate={new Date('2025-09-01')}
          maxDate={new Date()}
        />
      </div>

    </div>
  );
}
