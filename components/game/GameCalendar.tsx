'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isAfter, isBefore, startOfYear } from 'date-fns';
import { CalendarDay } from '@/lib/types';
import { getUserProgress } from '@/lib/storage';
import { CheckCircle, Lock, Calendar as CalendarIcon } from 'lucide-react';

interface GameCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
  minDate?: Date;
  maxDate?: Date;
}

export function GameCalendar({ onDateSelect, selectedDate, minDate, maxDate }: GameCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const progress = getUserProgress();
  
  // Calculate the first available date (e.g., game launch date)
  const gameStartDate = minDate || new Date('2024-01-01');
  const today = new Date();
  const latestDate = maxDate || today;

  // Calculate month boundaries for navigation
  const fromMonth = startOfMonth(gameStartDate); // September 2025
  const toMonth = startOfMonth(today); // Current month

  const generateCalendarDays = (): CalendarDay[] => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(date => {
      const dateString = format(date, 'yyyy-MM-dd');
      const isCompleted = progress.completedDates.includes(dateString);
      const isToday = isSameDay(date, today);
      const isPast = isBefore(date, today);
      const isFuture = isAfter(date, today);
      const isBeforeGameStart = isBefore(date, gameStartDate);
      const isAfterLatest = isAfter(date, latestDate);
      
      return {
        date: dateString,
        isCompleted,
        isToday,
        isPast: isPast && !isBeforeGameStart,
        isFuture: isFuture || isAfterLatest || isBeforeGameStart
      };
    });
  };

  const calendarDays = generateCalendarDays();

  const handleDateClick = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const calendarDay = calendarDays.find(day => day.date === dateString);
    
    if (calendarDay && !calendarDay.isFuture) {
      onDateSelect(date);
    }
  };

  const renderDayContent = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const calendarDay = calendarDays.find(day => day.date === dateString);
    
    if (!calendarDay) return null;
    
    const dayNumber = date.getDate();
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span className={`
          ${calendarDay.isToday ? 'font-bold' : ''}
          ${calendarDay.isFuture ? 'text-muted-foreground' : ''}
        `}>
          {dayNumber}
        </span>
        
        {calendarDay.isCompleted && (
          <CheckCircle className="absolute top-0 right-0 h-3 w-3 text-green-600" />
        )}
        
        {calendarDay.isFuture && (
          <Lock className="absolute top-0 right-0 h-3 w-3 text-muted-foreground" />
        )}
      </div>
    );
  };

  const completedCount = progress.completedDates.length;
  const availableDays = calendarDays.filter(day => !day.isFuture).length;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Game Calendar</h2>
          </div>
          <Badge variant="outline">
            {completedCount} / {availableDays} completed
          </Badge>
        </div>

        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && handleDateClick(date)}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            fromMonth={fromMonth}
            toMonth={toMonth}
            disabled={(date) => {
              const dateString = format(date, 'yyyy-MM-dd');
              const calendarDay = calendarDays.find(day => day.date === dateString);
              return calendarDay?.isFuture || false;
            }}
            modifiers={{
              completed: (date) => {
                const dateString = format(date, 'yyyy-MM-dd');
                return progress.completedDates.includes(dateString);
              },
              future: (date) => {
                const dateString = format(date, 'yyyy-MM-dd');
                const calendarDay = calendarDays.find(day => day.date === dateString);
                return calendarDay?.isFuture || false;
              }
            }}
            modifiersStyles={{
              completed: { position: 'relative' },
              future: { color: 'hsl(var(--muted-foreground))' }
            }}
            className="rounded-md border"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary rounded-sm" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <span>Locked</span>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            You've completed {completedCount} out of {availableDays} available puzzles
          </div>
          
          {completedCount > 0 && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / availableDays) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateSelect(today)}
            disabled={isSameDay(selectedDate, today)}
          >
            Today
          </Button>
          
          {completedCount < availableDays && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Find the earliest incomplete date
                const incompleteDates = calendarDays
                  .filter(day => !day.isFuture && !day.isCompleted)
                  .sort((a, b) => a.date.localeCompare(b.date));
                
                if (incompleteDates.length > 0) {
                  onDateSelect(new Date(incompleteDates[0].date));
                }
              }}
            >
              Earliest Incomplete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
