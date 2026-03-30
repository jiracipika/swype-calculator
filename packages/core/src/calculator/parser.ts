/**
 * Parser for calculator expressions
 */

import { isOperation } from '../math/basic';
import { getConstant } from '../math/constants';

export interface Token {
  type: 'number' | 'operator' | 'function' | 'parenthesis' | 'constant';
  value: string;
}

export interface ASTNode {
  type: 'number' | 'operator' | 'function' | 'constant';
  value: string;
  left?: ASTNode;
  right?: ASTNode;
  args?: ASTNode[];
}

const FUNCTIONS = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'log', 'ln', 'pow', 'factorial'];
const OPERATORS = ['+', '-', '×', '÷', '^', 'mod'];
const OPERATOR_PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '×': 2,
  '÷': 2,
  '^': 3,
  'mod': 2,
};

export function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expression.length) {
    const char = expression[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Numbers (including decimals and negative numbers)
    if (/\d/.test(char) || (char === '-' && i === 0)) {
      let numStr = char;
      i++;
      while (i < expression.length && (/[\d.]/.test(expression[i]))) {
        numStr += expression[i];
        i++;
      }
      tokens.push({ type: 'number', value: numStr });
      continue;
    }

    // Operators
    if (OPERATORS.includes(char)) {
      tokens.push({ type: 'operator', value: char });
      i++;
      continue;
    }

    // Functions
    if (/[a-zA-Z]/.test(char)) {
      let funcStr = '';
      while (i < expression.length && /[a-zA-Z]/.test(expression[i])) {
        funcStr += expression[i];
        i++;
      }

      // Check if it's a function
      if (FUNCTIONS.includes(funcStr.toLowerCase())) {
        tokens.push({ type: 'function', value: funcStr.toLowerCase() });
      } else {
        // Check if it's a constant
        const constant = getConstant(funcStr);
        if (constant !== undefined) {
          tokens.push({ type: 'constant', value: funcStr });
        } else {
          throw new Error(`Unknown function or constant: ${funcStr}`);
        }
      }
      continue;
    }

    // Parentheses
    if (char === '(' || char === ')') {
      tokens.push({ type: 'parenthesis', value: char });
      i++;
      continue;
    }

    i++;
  }

  return tokens;
}

export function buildAST(tokens: Token[]): ASTNode {
  // Convert tokens to postfix notation using Shunting Yard algorithm
  const output: ASTNode[] = [];
  const operators: string[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'number':
      case 'constant':
        output.push({ type: token.type, value: token.value });
        break;

      case 'function':
        operators.push(token.value);
        break;

      case 'operator':
        while (
          operators.length > 0 &&
          operators[operators.length - 1] !== '(' &&
          OPERATOR_PRECEDENCE[operators[operators.length - 1]] >=
            OPERATOR_PRECEDENCE[token.value]
        ) {
          const op = operators.pop()!;
          const right = output.pop()!;
          const left = output.pop()!;
          output.push({ type: 'operator', value: op, left, right });
        }
        operators.push(token.value);
        break;

      case 'parenthesis':
        if (token.value === '(') {
          operators.push(token.value);
        } else {
          while (operators.length > 0 && operators[operators.length - 1] !== '(') {
            const op = operators.pop()!;
            const right = output.pop()!;
            const left = output.pop()!;
            output.push({ type: 'operator', value: op, left, right });
          }
          operators.pop(); // Remove '('

          // Check if it's a function call
          if (operators.length > 0 && FUNCTIONS.includes(operators[operators.length - 1])) {
            const funcName = operators.pop()!;
            const arg = output.pop()!;
            output.push({ type: 'function', value: funcName, args: [arg] });
          }
        }
        break;
    }
  }

  while (operators.length > 0) {
    const op = operators.pop()!;
    const right = output.pop()!;
    const left = output.pop()!;
    output.push({ type: 'operator', value: op, left, right });
  }

  if (output.length !== 1) {
    throw new Error('Invalid expression');
  }

  return output[0];
}

export function parse(expression: string): ASTNode {
  const tokens = tokenize(expression);
  return buildAST(tokens);
}
