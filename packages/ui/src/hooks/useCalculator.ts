/**
 * useCalculator hook - manages calculator state and logic
 */

import { useState, useCallback } from 'react';
import { CalculatorHistory, evaluate, parse } from '@swype-calc/core';

export interface UseCalculatorState {
  expression: string;
  result: string;
  showResult: boolean;
  history: import('@swype-calc/core').HistoryEntry[];
  error: string | null;
}

export const useCalculator = () => {
  const [state, setState] = useState<UseCalculatorState>({
    expression: '',
    result: '0',
    showResult: false,
    history: [],
    error: null,
  });

  const historyRef = useState(new CalculatorHistory())[0];

  const addToExpression = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      expression: prev.expression + value,
      showResult: false,
      error: null,
    }));
  }, []);

  const clearExpression = useCallback(() => {
    setState({
      expression: '',
      result: '0',
      showResult: false,
      history: state.history,
      error: null,
    });
  }, [state.history]);

  const backspace = useCallback(() => {
    setState((prev) => {
      const newExpression = prev.expression.slice(0, -1);
      return {
        ...prev,
        expression: newExpression,
        showResult: false,
      };
    });
  }, []);

  const calculate = useCallback(() => {
    setState((prev) => {
      try {
        if (!prev.expression || prev.expression.trim() === '') {
          return {
            ...prev,
            result: '0',
            showResult: true,
            error: null,
          };
        }

        const result = evaluate(prev.expression);
        const formattedResult = formatNumber(result);

        // Add to history
        historyRef.add(prev.expression, result);

        return {
          ...prev,
          result: formattedResult,
          showResult: true,
          history: historyRef.getAll(),
          error: null,
        };
      } catch (error) {
        return {
          ...prev,
          error: error instanceof Error ? error.message : 'Calculation error',
          showResult: false,
        };
      }
    });
  }, [historyRef]);

  const toggleSign = useCallback(() => {
    setState((prev) => {
      if (prev.showResult) {
        const num = parseFloat(prev.result);
        const toggled = -num;
        return {
          ...prev,
          result: formatNumber(toggled),
        };
      } else {
        // Toggle sign of last number in expression
        const newExpression = prev.expression.replace(/(-?\d+(\.\d+)?)$/, (match) => {
          const num = parseFloat(match);
          return formatNumber(-num);
        });
        return {
          ...prev,
          expression: newExpression,
        };
      }
    });
  }, []);

  const useFromHistory = useCallback((entry: import('@swype-calc/core').HistoryEntry) => {
    setState((prev) => ({
      ...prev,
      expression: entry.expression,
      result: formatNumber(entry.result),
      showResult: true,
      error: null,
    }));
  }, []);

  const clearHistory = useCallback(() => {
    historyRef.clear();
    setState((prev) => ({
      ...prev,
      history: [],
    }));
  }, [historyRef]);

  const handleInput = useCallback((value: string) => {
    switch (value) {
      case 'C':
        clearExpression();
        break;
      case '=':
        calculate();
        break;
      case '⌫':
        backspace();
        break;
      case '±':
        toggleSign();
        break;
      default:
        addToExpression(value);
    }
  }, [addToExpression, clearExpression, calculate, backspace, toggleSign]);

  return {
    ...state,
    addToExpression,
    clearExpression,
    backspace,
    calculate,
    toggleSign,
    useFromHistory,
    clearHistory,
    handleInput,
  };
};

function formatNumber(num: number): string {
  if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-10 && num !== 0)) {
    return num.toExponential(6);
  }
  const rounded = Math.round(num * 1e10) / 1e10;
  return rounded.toString();
}

export default useCalculator;
