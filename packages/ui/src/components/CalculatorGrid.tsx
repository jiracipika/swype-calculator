/**
 * iOS-style calculator grid
 */

import React from 'react';
import { Button, ButtonProps } from './Button';

export interface GridItem {
  value: string;
  type?: ButtonProps['type'];
  position: { row: number; col: number };
  colSpan?: number;
  label?: string;
}

export interface CalculatorGridProps {
  items: GridItem[];
  onButtonPress: (value: string) => void;
  onButtonLongPress?: (value: string) => void;
  gridTemplateColumns?: string;
  gap?: string;
  className?: string;
}

export const CalculatorGrid: React.FC<CalculatorGridProps> = ({
  items,
  onButtonPress,
  onButtonLongPress,
  gridTemplateColumns = 'repeat(4, 1fr)',
  gap = 'var(--ios-gap, 8px)',
  className = '',
}) => {
  const rows = Math.max(...items.map((item) => item.position.row)) + 1;

  const sortedItems = [...items].sort((a, b) => {
    if (a.position.row !== b.position.row) return a.position.row - b.position.row;
    return a.position.col - b.position.col;
  });

  return (
    <div
      className={`calculator-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap,
        padding: 'var(--ios-pad, 16px)',
        paddingBottom: 'max(var(--ios-pad, 16px), env(safe-area-inset-bottom))',
        flex: 1,
      }}
    >
      {sortedItems.map((item, index) => (
        <div
          key={`${item.value}-${index}`}
          style={{
            gridRow: item.position.row + 1,
            gridColumn: item.colSpan
              ? `${item.position.col + 1} / span ${item.colSpan}`
              : item.position.col + 1,
            minHeight: '64px',
          }}
        >
          <Button
            value={item.value}
            type={item.type}
            onPress={() => onButtonPress(item.value)}
            onLongPress={() => onButtonLongPress?.(item.value)}
          >
            {item.label ?? item.value}
          </Button>
        </div>
      ))}
    </div>
  );
};

/**
 * iOS-inspired button layout for Swype Calculator
 *
 * Row 0: sin  cos  tan  ⌫
 * Row 1: (    )    C    ÷
 * Row 2: 7    8    9    ×
 * Row 3: 4    5    6    −
 * Row 4: 1    2    3    +
 * Row 5: 0 (×2)   .    =
 */
export const createDefaultGridItems = (): GridItem[] => [
  // Row 0 — scientific functions + backspace
  { value: 'sin', type: 'function', position: { row: 0, col: 0 } },
  { value: 'cos', type: 'function', position: { row: 0, col: 1 } },
  { value: 'tan', type: 'function', position: { row: 0, col: 2 } },
  { value: '⌫',   type: 'function', position: { row: 0, col: 3 } },

  // Row 1 — parentheses + clear + divide
  { value: '(',   type: 'function', position: { row: 1, col: 0 } },
  { value: ')',   type: 'function', position: { row: 1, col: 1 } },
  { value: 'C',   type: 'function', position: { row: 1, col: 2 } },
  { value: '÷',   type: 'operator', position: { row: 1, col: 3 } },

  // Row 2
  { value: '7', type: 'number', position: { row: 2, col: 0 } },
  { value: '8', type: 'number', position: { row: 2, col: 1 } },
  { value: '9', type: 'number', position: { row: 2, col: 2 } },
  { value: '×', type: 'operator', position: { row: 2, col: 3 } },

  // Row 3
  { value: '4', type: 'number', position: { row: 3, col: 0 } },
  { value: '5', type: 'number', position: { row: 3, col: 1 } },
  { value: '6', type: 'number', position: { row: 3, col: 2 } },
  { value: '-', type: 'operator', position: { row: 3, col: 3 }, label: '−' },

  // Row 4
  { value: '1', type: 'number', position: { row: 4, col: 0 } },
  { value: '2', type: 'number', position: { row: 4, col: 1 } },
  { value: '3', type: 'number', position: { row: 4, col: 2 } },
  { value: '+', type: 'operator', position: { row: 4, col: 3 } },

  // Row 5 — zero spans 2 columns
  { value: '0', type: 'number', position: { row: 5, col: 0 }, colSpan: 2 },
  { value: '.', type: 'number', position: { row: 5, col: 2 } },
  { value: '=', type: 'operator', position: { row: 5, col: 3 } },
];

export default CalculatorGrid;
