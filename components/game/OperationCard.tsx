'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Operation } from '@/lib/types';
import { GripVertical } from 'lucide-react';

interface OperationCardProps {
  operation: Operation;
  isInSequence?: boolean;
  isDragOverlay?: boolean;
}

export function OperationCard({ operation, isInSequence = false, isDragOverlay = false }: OperationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: operation.id,
    disabled: isDragOverlay
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        relative p-4 flex items-center justify-center min-h-[60px] min-w-[80px] 
        cursor-grab active:cursor-grabbing select-none
        ${isDragging ? 'opacity-50' : ''}
        ${isDragOverlay ? 'shadow-lg rotate-3' : ''}
        ${isInSequence 
          ? 'bg-primary text-primary-foreground border-primary shadow-md' 
          : 'bg-card hover:bg-accent hover:text-accent-foreground border-2 border-dashed border-muted-foreground/30'
        }
        transition-all duration-200 ease-in-out
      `}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 opacity-50" />
        <span className="font-mono text-lg font-semibold">
          {operation.label}
        </span>
      </div>
    </Card>
  );
}
