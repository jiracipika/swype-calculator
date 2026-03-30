/**
 * Map gestures to calculator operations
 */

import { GestureType } from './recognizer';
import { Operation } from '../math/basic';

export interface GestureMapping {
  gesture: GestureType;
  operation: Operation | 'C' | '=' | '(' | ')' | 'undo' | 'redo' | 'backspace';
  context?: string;
}

/**
 * Default gesture mappings
 */
export const DEFAULT_GESTURE_MAPPINGS: GestureMapping[] = [
  { gesture: 'swipe-right', operation: '+' },
  { gesture: 'swipe-left', operation: '-' },
  { gesture: 'swipe-up', operation: '×' },
  { gesture: 'swipe-down', operation: '÷' },
  { gesture: 'circle-clockwise', operation: '=' },
  { gesture: 'circle-counterclockwise', operation: 'C' },
  { gesture: 'tap', operation: 'backspace', context: 'backspace-area' },
  { gesture: 'swipe-right', operation: 'undo', context: 'history' },
  { gesture: 'swipe-left', operation: 'redo', context: 'history' },
];

/**
 * Map gesture to operation
 */
export function mapGesture(
  gesture: GestureType,
  context?: string
): Operation | 'C' | '=' | '(' | ')' | 'undo' | 'redo' | 'backspace' | null {
  // Find exact match with context
  const exactMatch = DEFAULT_GESTURE_MAPPINGS.find(
    (mapping) => mapping.gesture === gesture && mapping.context === context
  );
  if (exactMatch) {
    return exactMatch.operation;
  }

  // Find exact match without context
  const contextlessMatch = DEFAULT_GESTURE_MAPPINGS.find(
    (mapping) => mapping.gesture === gesture && !mapping.context
  );
  if (contextlessMatch) {
    return contextlessMatch.operation;
  }

  return null;
}

/**
 * Add custom gesture mapping
 */
export function addGestureMapping(mapping: GestureMapping): void {
  DEFAULT_GESTURE_MAPPINGS.push(mapping);
}

/**
 * Remove gesture mapping
 */
export function removeGestureMapping(gesture: GestureType, context?: string): boolean {
  const index = DEFAULT_GESTURE_MAPPINGS.findIndex(
    (mapping) => mapping.gesture === gesture && mapping.context === context
  );
  if (index !== -1) {
    DEFAULT_GESTURE_MAPPINGS.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Get all mappings
 */
export function getAllMappings(): GestureMapping[] {
  return [...DEFAULT_GESTURE_MAPPINGS];
}
