'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OperationCard } from './OperationCard';
import { GameData, Operation } from '@/lib/types';
import { calculateResult, checkIfSolutionComplete, formatNumber } from '@/lib/game-logic';
import { ArrowRight, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

interface GameBoardProps {
  gameData: GameData;
  onGameComplete: (isCorrect: boolean, submittedSolution: string[]) => void;
  submittedResult?: {
    completed: boolean;
    attempts: number;
    solvedAt: string;
    submittedSolution?: string[];
    isCorrect?: boolean;
  } | null;
  isReviewMode?: boolean;
}

export function GameBoard({ gameData, onGameComplete, submittedResult, isReviewMode }: GameBoardProps) {
  const [userOperations, setUserOperations] = useState<Operation[]>([]);
  const [availableOperations, setAvailableOperations] = useState<Operation[]>(gameData.operations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(isReviewMode || false);
  const [finalResult, setFinalResult] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Initialize review mode state
  useEffect(() => {
    if (isReviewMode && submittedResult?.submittedSolution) {
      // Reconstruct the user's submitted operation order
      const submittedOps: Operation[] = [];
      const remainingOps = [...gameData.operations];
      
      submittedResult.submittedSolution.forEach(opId => {
        const op = remainingOps.find(o => o.id === opId);
        if (op) {
          submittedOps.push(op);
          const index = remainingOps.findIndex(o => o.id === opId);
          remainingOps.splice(index, 1);
        }
      });
      
      setUserOperations(submittedOps);
      setAvailableOperations(remainingOps);
      setIsSubmitted(true);
      
      // Calculate and set the result
      const result = calculateResult(gameData.inputNumber, submittedOps);
      setFinalResult(result);
      setIsCorrect(submittedResult.isCorrect || false);
    }
  }, [isReviewMode, submittedResult, gameData]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  function handleDragStart(event: DragStartEvent) {
    if (isSubmitted) return;
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    if (isSubmitted) return;
    
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find which container the active item is currently in
    const activeContainer = availableOperations.find(op => op.id === activeId) ? 'available' : 'sequence';
    
    // Find which container we're dropping into
    let overContainer: string;
    if (overId === 'sequence-area' || userOperations.find(op => op.id === overId)) {
      overContainer = 'sequence';
    } else if (overId === 'available-area' || availableOperations.find(op => op.id === overId)) {
      overContainer = 'available';
    } else {
      return;
    }

    // If moving between containers
    if (activeContainer !== overContainer) {
      if (activeContainer === 'available' && overContainer === 'sequence') {
        // Moving from available to sequence
        const operation = availableOperations.find(op => op.id === activeId);
        if (operation) {
          setUserOperations(prev => [...prev, operation]);
          setAvailableOperations(prev => prev.filter(op => op.id !== activeId));
        }
      } else if (activeContainer === 'sequence' && overContainer === 'available') {
        // Moving from sequence to available
        const operation = userOperations.find(op => op.id === activeId);
        if (operation) {
          setUserOperations(prev => prev.filter(op => op.id !== activeId));
          setAvailableOperations(prev => [...prev, operation]);
        }
      }
    } else {
      // Reordering within the same container
      if (activeContainer === 'sequence' && userOperations.find(op => op.id === overId)) {
        const oldIndex = userOperations.findIndex(op => op.id === activeId);
        const newIndex = userOperations.findIndex(op => op.id === overId);
        
        if (oldIndex !== newIndex) {
          setUserOperations(prev => arrayMove(prev, oldIndex, newIndex));
        }
      }
    }
  }

  function resetGame() {
    if (isSubmitted) return;
    setUserOperations([]);
    setAvailableOperations(gameData.operations);
  }

  function submitSolution() {
    if (userOperations.length !== gameData.operations.length || isSubmitted) return;
    
    // Calculate the final result
    const result = calculateResult(gameData.inputNumber, userOperations);
    setFinalResult(result);
    
    // Check if solution is correct
    const correct = checkIfSolutionComplete(
      gameData.inputNumber,
      gameData.targetNumber,
      userOperations,
      gameData.operations
    );
    
    setIsCorrect(correct);
    setIsSubmitted(true);
    
    // Call onGameComplete with the submitted solution
    const submittedSolution = userOperations.map(op => op.id);
    onGameComplete(correct, submittedSolution);
  }

  const activeOperation = activeId ? 
    [...userOperations, ...availableOperations].find(op => op.id === activeId) : null;

  const hasAllOperations = userOperations.length === gameData.operations.length;
  const canSubmit = hasAllOperations && !isSubmitted;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Game Header with Kanban-style Operation Flow */}
        <div className="text-center space-y-6">
          {/* Current Result Display - Only show after submission */}
          {isSubmitted && finalResult !== null && (
            <div className="flex items-center justify-center gap-2">
              <Badge 
                variant={isCorrect ? "default" : "secondary"}
                className="text-lg px-3 py-1"
              >
                {formatNumber(finalResult)}
              </Badge>
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
          )}

          {/* Kanban-style Operation Flow */}
          <div className="flex items-center justify-center gap-4">
            {/* Input Number */}
            <Badge variant="outline" className="text-2xl px-6 py-3 font-bold">
              {formatNumber(gameData.inputNumber)}
            </Badge>

            {/* Operation Sequence Area - Dynamic width based on operation count */}
            <SortableContext items={userOperations.map(op => op.id)} strategy={verticalListSortingStrategy}>
              <SequenceDropArea
                operations={userOperations}
                minWidth={Math.max(200, gameData.operations.length * 100)}
                isLocked={isSubmitted}
              />
            </SortableContext>

            {/* Output Number */}
            <Badge variant="outline" className="text-2xl px-6 py-3 font-bold">
              {formatNumber(gameData.targetNumber)}
            </Badge>
          </div>
        </div>

        {/* Available Operations */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Available Operations</h3>
          <SortableContext items={availableOperations.map(op => op.id)} strategy={verticalListSortingStrategy}>
            <AvailableDropArea operations={availableOperations} isLocked={isSubmitted} />
          </SortableContext>
        </Card>

        {/* Game Controls */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={resetGame}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isSubmitted}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          
          {canSubmit && (
            <Button onClick={submitSolution} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Submit Solution
            </Button>
          )}
        </div>

        {/* Result Message */}
        {isSubmitted && isCorrect !== null && (
          <Card className={`p-6 ${
            isCorrect 
              ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
              : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
          }`}>
            <div className="text-center space-y-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    Congratulations!
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    You solved today's Operdle!
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="h-8 w-8 text-red-600 mx-auto" />
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                    Not quite right!
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    Your solution resulted in {formatNumber(finalResult!)} instead of {formatNumber(gameData.targetNumber)}.
                  </p>
                </>
              )}
            </div>
          </Card>
        )}
      </div>

      <DragOverlay>
        {activeOperation ? (
          <OperationCard operation={activeOperation} isDragOverlay={true} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function SequenceDropArea({ operations, minWidth, isLocked }: { operations: Operation[]; minWidth: number; isLocked?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'sequence-area',
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed rounded-lg transition-colors min-h-[60px] ${
        isOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-muted-foreground/30'
      }`}
      style={{ 
        minWidth: `${Math.max(minWidth, 300)}px`
      }}
    >
      {operations.length === 0 ? (
        <div className="text-muted-foreground text-sm py-2">Drag operations here</div>
      ) : (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {operations.map((operation, index) => (
            <div key={operation.id} className="flex items-center gap-2">
              {index > 0 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
              <OperationCard operation={operation} />
            </div>
          ))}
        </div>
      )}
      
      {/* Invisible overlay to ensure entire area is droppable */}
      <div className="absolute inset-0 pointer-events-none" />
    </div>
  );
}

function AvailableDropArea({ operations, isLocked }: { operations: Operation[]; isLocked?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'available-area',
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[100px] border-2 border-dashed rounded-lg p-4 transition-colors ${
        isOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-muted-foreground/30'
      }`}
    >
      {operations.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          All operations used!
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 justify-center">
          {operations.map((operation) => (
            <OperationCard key={operation.id} operation={operation} />
          ))}
        </div>
      )}
    </div>
  );
}
