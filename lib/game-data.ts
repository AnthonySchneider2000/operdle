import { format, addDays } from 'date-fns';
import { GameData, Operation, OperationType } from './types';

// Seed for consistent daily puzzles
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDateSeed(date: string): number {
  return date.split('-').reduce((acc, part) => acc + parseInt(part), 0);
}

function generateOperations(seed: number, count: number): Operation[] {
  const operations: Operation[] = [];
  const operationTypes: OperationType[] = ['+', '-', '*', '/', 'square', 'cube', 'sqrt'];
  
  for (let i = 0; i < count; i++) {
    const typeSeed = seed + i * 1000;
    const typeIndex = Math.floor(seededRandom(typeSeed) * operationTypes.length);
    const type = operationTypes[typeIndex];
    
    let operation: Operation;
    
    switch (type) {
      case '+':
      case '-':
        const addSubValue = Math.floor(seededRandom(typeSeed + 1) * 20) + 1;
        operation = {
          id: `${type}-${addSubValue}-${i}`,
          type,
          value: addSubValue,
          label: `${type}${addSubValue}`
        };
        break;
      case '*':
      case '/':
        const mulDivValue = Math.floor(seededRandom(typeSeed + 1) * 8) + 2;
        operation = {
          id: `${type}-${mulDivValue}-${i}`,
          type,
          value: mulDivValue,
          label: type === '*' ? `×${mulDivValue}` : `÷${mulDivValue}`
        };
        break;
      case 'square':
        operation = {
          id: `square-${i}`,
          type: 'square',
          label: 'x²'
        };
        break;
      case 'cube':
        operation = {
          id: `cube-${i}`,
          type: 'cube',
          label: 'x³'
        };
        break;
      case 'sqrt':
        operation = {
          id: `sqrt-${i}`,
          type: 'sqrt',
          label: '√x'
        };
        break;
    }
    
    operations.push(operation);
  }
  
  return operations;
}

function applyOperation(value: number, operation: Operation): number {
  switch (operation.type) {
    case '+':
      return value + (operation.value || 0);
    case '-':
      return value - (operation.value || 0);
    case '*':
      return value * (operation.value || 1);
    case '/':
      return value / (operation.value || 1);
    case 'square':
      return value * value;
    case 'cube':
      return value * value * value;
    case 'sqrt':
      return Math.sqrt(value);
    default:
      return value;
  }
}

function findValidSolution(inputNumber: number, operations: Operation[]): {
  targetNumber: number;
  solution: string[];
} | null {
  // Try different permutations to find a valid solution
  const maxAttempts = 100;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    // Shuffle operations for this attempt
    const shuffled = [...operations].sort(() => Math.random() - 0.5);
    
    let currentValue = inputNumber;
    const solutionPath: string[] = [];
    
    // Apply operations in sequence
    for (const operation of shuffled) {
      currentValue = applyOperation(currentValue, operation);
      solutionPath.push(operation.id);
      
      // Check if result is reasonable (not too large, not negative for sqrt, etc.)
      if (currentValue < 0 && operation.type === 'sqrt') break;
      if (currentValue > 10000) break;
      if (!Number.isFinite(currentValue)) break;
    }
    
    // Check if we have a valid target number
    const targetNumber = Math.round(currentValue * 100) / 100; // Round to 2 decimal places
    
    if (Number.isFinite(targetNumber) && targetNumber > 0 && targetNumber < 10000) {
      return {
        targetNumber,
        solution: solutionPath
      };
    }
    
    attempts++;
  }
  
  return null;
}

export function generateGameData(date: string): GameData {
  const seed = getDateSeed(date);
  
  // Generate input number (1-100)
  const inputNumber = Math.floor(seededRandom(seed) * 99) + 1;
  
  // Generate 3-6 operations
  const operationCount = Math.floor(seededRandom(seed + 100) * 4) + 3;
  const operations = generateOperations(seed + 200, operationCount);
  
  // Find a valid solution
  const solutionData = findValidSolution(inputNumber, operations);
  
  if (!solutionData) {
    // Fallback: create a simple puzzle
    const fallbackOperations: Operation[] = [
      { id: 'add-5', type: '+', value: 5, label: '+5' },
      { id: 'mul-2', type: '*', value: 2, label: '×2' },
      { id: 'sub-3', type: '-', value: 3, label: '-3' }
    ];
    
    return {
      date,
      inputNumber,
      targetNumber: ((inputNumber + 5) * 2) - 3,
      operations: fallbackOperations,
      solution: ['add-5', 'mul-2', 'sub-3']
    };
  }
  
  return {
    date,
    inputNumber,
    targetNumber: solutionData.targetNumber,
    operations,
    solution: solutionData.solution
  };
}

export function getTodaysGameData(): GameData {
  const today = format(new Date(), 'yyyy-MM-dd');
  return generateGameData(today);
}

export function getGameDataForDate(date: Date): GameData {
  const dateString = format(date, 'yyyy-MM-dd');
  return generateGameData(dateString);
}
