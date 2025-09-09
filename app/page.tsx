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
  const [showCalendar, setShowCalendar] = useState(false);
  
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
    setShowCalendar(false);
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

      {/* Date and Stats Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              {format(selectedDate, 'MMMM d, yyyy')}
            </Button>
            
            {isToday && <Badge variant="default">Today</Badge>}
            {isCompleted && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Completed
              </Badge>
            )}
          </div>

          {userProgress && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                {userProgress.completedDates.length} solved
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {result ? `${result.attempts} attempts` : 'Not attempted'}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Calendar (conditional) */}
      {showCalendar && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <GameCalendar
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            minDate={new Date('2024-01-01')}
            maxDate={new Date()}
          />
        </div>
      )}

      <Separator />

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

      {/* Instructions */}
      <Card className="p-6 bg-muted/50">
        <h3 className="text-lg font-semibold mb-3">How to Play</h3>
        <div className="grid gap-3 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <span className="font-semibold text-primary">1.</span>
            <span>Drag operations from the available pool to the sequence area</span>
          </div>
          <div className="flex gap-3">
            <span className="font-semibold text-primary">2.</span>
            <span>Arrange them in the correct order to transform the input number to the target</span>
          </div>
          <div className="flex gap-3">
            <span className="font-semibold text-primary">3.</span>
            <span>Use all operations exactly once to complete the puzzle</span>
          </div>
          <div className="flex gap-3">
            <span className="font-semibold text-primary">4.</span>
            <span>Each day has a new puzzle with different operations and numbers</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
