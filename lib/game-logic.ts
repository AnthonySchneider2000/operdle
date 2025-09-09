import { Operation, GameState } from './types';

export function applyOperation(value: number, operation: Operation): number {
  switch (operation.type) {
    case '+':
      return value + (operation.value || 0);
    case '-':
      return value - (operation.value || 0);
    case '*':
      return value * (operation.value || 1);
    case '/':
      return Math.round((value / (operation.value || 1)) * 100) / 100;
    case 'square':
      return value * value;
    case 'cube':
      return value * value * value;
    case 'sqrt':
      return Math.round(Math.sqrt(Math.abs(value)) * 100) / 100;
    default:
      return value;
  }
}

export function calculateResult(inputNumber: number, operations: Operation[]): number {
  let result = inputNumber;
  
  for (const operation of operations) {
    result = applyOperation(result, operation);
    
    // Handle edge cases
    if (!Number.isFinite(result)) {
      result = 0;
      break;
    }
  }
  
  return Math.round(result * 100) / 100; // Round to 2 decimal places
}

export function validateSolution(
  inputNumber: number,
  targetNumber: number,
  userOperations: Operation[]
): GameState {
  const currentResult = calculateResult(inputNumber, userOperations);
  const isCorrect = Math.abs(currentResult - targetNumber) < 0.01; // Allow for floating point precision
  
  return {
    currentOperations: userOperations,
    isComplete: userOperations.length > 0,
    isCorrect,
    currentResult
  };
}

export function checkIfSolutionComplete(
  inputNumber: number,
  targetNumber: number,
  userOperations: Operation[],
  availableOperations: Operation[]
): boolean {
  // Check if user has used all operations
  if (userOperations.length !== availableOperations.length) {
    return false;
  }
  
  // Check if all available operations are used
  const usedOperationIds = new Set(userOperations.map(op => op.id));
  const availableOperationIds = new Set(availableOperations.map(op => op.id));
  
  if (usedOperationIds.size !== availableOperationIds.size) {
    return false;
  }
  
  for (const id of availableOperationIds) {
    if (!usedOperationIds.has(id)) {
      return false;
    }
  }
  
  // Check if result matches target
  const result = calculateResult(inputNumber, userOperations);
  return Math.abs(result - targetNumber) < 0.01;
}

export function getHint(
  inputNumber: number,
  targetNumber: number,
  correctSolution: string[],
  userOperations: Operation[],
  availableOperations: Operation[]
): string | null {
  if (userOperations.length === 0) {
    const firstOperationId = correctSolution[0];
    const firstOperation = availableOperations.find(op => op.id === firstOperationId);
    return firstOperation ? `Try starting with: ${firstOperation.label}` : null;
  }
  
  // Check if user's first operation is correct
  const userFirstOp = userOperations[0];
  const correctFirstOpId = correctSolution[0];
  
  if (userFirstOp.id !== correctFirstOpId) {
    const correctFirstOp = availableOperations.find(op => op.id === correctFirstOpId);
    return correctFirstOp ? `The first operation should be: ${correctFirstOp.label}` : null;
  }
  
  // If they have the right start, give next hint
  if (userOperations.length < correctSolution.length) {
    const nextCorrectOpId = correctSolution[userOperations.length];
    const nextCorrectOp = availableOperations.find(op => op.id === nextCorrectOpId);
    return nextCorrectOp ? `Next operation: ${nextCorrectOp.label}` : null;
  }
  
  return null;
}

export function formatNumber(num: number): string {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  
  // Round to 2 decimal places and remove trailing zeros
  const rounded = Math.round(num * 100) / 100;
  return rounded.toString();
}
