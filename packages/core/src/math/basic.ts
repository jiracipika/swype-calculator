/**
 * Basic arithmetic operations
 */

export type Operation = '+' | '-' | '×' | '÷';

export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

export function negate(num: number): number {
  return -num;
}

export function applyOperation(a: number, b: number, op: Operation): number {
  switch (op) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '×':
      return multiply(a, b);
    case '÷':
      return divide(a, b);
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
}

export function isOperation(char: string): char is Operation {
  return ['+', '-', '×', '÷'].includes(char);
}
