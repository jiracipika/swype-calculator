/**
 * Evaluator for calculator expressions
 */

import { ASTNode } from './parser';
import * as basic from '../math/basic';
import * as scientific from '../math/scientific';
import { getConstant } from '../math/constants';

export function evaluateNode(node: ASTNode): number {
  switch (node.type) {
    case 'number':
      return parseFloat(node.value);

    case 'constant':
      const constant = getConstant(node.value);
      if (constant === undefined) {
        throw new Error(`Unknown constant: ${node.value}`);
      }
      return constant;

    case 'operator':
      if (!node.left || !node.right) {
        throw new Error('Operator requires two operands');
      }
      const left = evaluateNode(node.left);
      const right = evaluateNode(node.right);

      switch (node.value) {
        case '+':
          return basic.add(left, right);
        case '-':
          return basic.subtract(left, right);
        case '×':
          return basic.multiply(left, right);
        case '÷':
          return basic.divide(left, right);
        case '^':
          return scientific.power(left, right);
        case 'mod':
          return left % right;
        default:
          throw new Error(`Unknown operator: ${node.value}`);
      }

    case 'function':
      if (!node.args || node.args.length === 0) {
        throw new Error('Function requires arguments');
      }
      const arg = evaluateNode(node.args[0]);

      switch (node.value) {
        case 'sin':
          return scientific.sin(arg);
        case 'cos':
          return scientific.cos(arg);
        case 'tan':
          return scientific.tan(arg);
        case 'asin':
          return scientific.asin(arg);
        case 'acos':
          return scientific.acos(arg);
        case 'atan':
          return scientific.atan(arg);
        case 'sqrt':
          return scientific.sqrt(arg);
        case 'log':
          return scientific.log(arg);
        case 'ln':
          return scientific.ln(arg);
        case 'pow':
          if (node.args.length !== 2) {
            throw new Error('pow requires two arguments');
          }
          return scientific.power(arg, evaluateNode(node.args[1]));
        case 'factorial':
          return scientific.factorial(arg);
        default:
          throw new Error(`Unknown function: ${node.value}`);
      }

    default:
      throw new Error(`Unknown node type: ${(node as any).type}`);
  }
}

export function evaluate(expression: string): number {
  const { parse } = require('./parser');
  const ast = parse(expression);
  return evaluateNode(ast);
}

export function evaluateWithPrecision(expression: string, precision = 10): number {
  const result = evaluate(expression);
  return Math.round(result * Math.pow(10, precision)) / Math.pow(10, precision);
}
