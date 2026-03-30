/**
 * @swype-calc/ui - Shared UI components
 */

// Components
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { CalculatorGrid, createDefaultGridItems } from './components/CalculatorGrid';
export type { GridItem, CalculatorGridProps } from './components/CalculatorGrid';

export { Display } from './components/Display';
export type { DisplayProps } from './components/Display';

export { HistoryPanel } from './components/HistoryPanel';
export type { HistoryPanelProps } from './components/HistoryPanel';

export { SwipeTrail } from './components/SwipeTrail';
export type { SwipeTrailProps } from './components/SwipeTrail';

// Hooks
export { useSwipe } from './hooks/useSwipe';
export type { UseSwipeOptions, SwipeHandlers } from './hooks/useSwipe';

export { useCalculator } from './hooks/useCalculator';
export type { UseCalculatorState } from './hooks/useCalculator';

// Styles
export { colors } from './styles/colors';
export type { ColorKey } from './styles/colors';

export { easings, durations, animations, keyframes } from './styles/animations';
