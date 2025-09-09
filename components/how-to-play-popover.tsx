'use client';

import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function HowToPlayPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">How to play</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">How to Play</h3>
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
        </div>
      </PopoverContent>
    </Popover>
  );
}
