/**
 * Parser for calculator expressions
 */
interface Token {
    type: 'number' | 'operator' | 'function' | 'parenthesis' | 'constant';
    value: string;
}
interface ASTNode {
    type: 'number' | 'operator' | 'function' | 'constant';
    value: string;
    left?: ASTNode;
    right?: ASTNode;
    args?: ASTNode[];
}
declare function tokenize(expression: string): Token[];
declare function buildAST(tokens: Token[]): ASTNode;
declare function parse(expression: string): ASTNode;

/**
 * Evaluator for calculator expressions
 */

declare function evaluateNode(node: ASTNode): number;
declare function evaluate(expression: string): number;
declare function evaluateWithPrecision(expression: string, precision?: number): number;

/**
 * History management for calculator
 */
interface HistoryEntry {
    expression: string;
    result: number;
    timestamp: number;
}
declare class CalculatorHistory {
    private entries;
    private maxSize;
    constructor(maxSize?: number);
    add(expression: string, result: number): void;
    getAll(): HistoryEntry[];
    getRecent(count: number): HistoryEntry[];
    clear(): void;
    get(index: number): HistoryEntry | undefined;
    size(): number;
    undo(): HistoryEntry | undefined;
    getLast(): HistoryEntry | undefined;
}

/**
 * Basic arithmetic operations
 */
type Operation = '+' | '-' | '×' | '÷';
declare function add(a: number, b: number): number;
declare function subtract(a: number, b: number): number;
declare function multiply(a: number, b: number): number;
declare function divide(a: number, b: number): number;
declare function negate(num: number): number;
declare function applyOperation(a: number, b: number, op: Operation): number;
declare function isOperation(char: string): char is Operation;

/**
 * Scientific mathematical functions
 */
declare function sin(angle: number, degrees?: boolean): number;
declare function cos(angle: number, degrees?: boolean): number;
declare function tan(angle: number, degrees?: boolean): number;
declare function asin(value: number, degrees?: boolean): number;
declare function acos(value: number, degrees?: boolean): number;
declare function atan(value: number, degrees?: boolean): number;
declare function sqrt(value: number): number;
declare function power(base: number, exponent: number): number;
declare function log(value: number, base?: number): number;
declare function ln(value: number): number;
declare function factorial(n: number): number;
declare function percent(value: number): number;

/**
 * Mathematical constants
 */
declare const PI: number;
declare const E: number;
declare const GOLDEN_RATIO: number;
declare function getConstant(name: string): number | undefined;

/**
 * Touch trail smoothing using Bézier curves
 */
interface Point {
    x: number;
    y: number;
    timestamp?: number;
}
/**
 * Apply Bézier curve smoothing to a set of points
 */
declare function smoothBezier(points: Point[], tension?: number): Point[];
/**
 * Apply moving average smoothing (simpler, faster)
 */
declare function smoothMovingAverage(points: Point[], windowSize?: number): Point[];
/**
 * Resample points to uniform distance
 */
declare function resamplePoints(points: Point[], distance?: number): Point[];
/**
 * Calculate distance between two points
 */
declare function distanceBetween(p1: Point, p2: Point): number;
/**
 * Calculate total length of a path
 */
declare function pathLength(points: Point[]): number;

/**
 * Gesture recognizer from touch points
 */

type GestureType = 'tap' | 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'circle-clockwise' | 'circle-counterclockwise' | 'unknown';
interface Gesture {
    type: GestureType;
    confidence: number;
    points: Point[];
    start: Point;
    end: Point;
    duration: number;
}
/**
 * Recognize gesture from a series of points
 */
declare function recognizeGesture(points: Point[]): Gesture;

/**
 * Map gestures to calculator operations
 */

interface GestureMapping {
    gesture: GestureType;
    operation: Operation | 'C' | '=' | '(' | ')' | 'undo' | 'redo' | 'backspace';
    context?: string;
}
/**
 * Default gesture mappings
 */
declare const DEFAULT_GESTURE_MAPPINGS: GestureMapping[];
/**
 * Map gesture to operation
 */
declare function mapGesture(gesture: GestureType, context?: string): Operation | 'C' | '=' | '(' | ')' | 'undo' | 'redo' | 'backspace' | null;
/**
 * Add custom gesture mapping
 */
declare function addGestureMapping(mapping: GestureMapping): void;
/**
 * Remove gesture mapping
 */
declare function removeGestureMapping(gesture: GestureType, context?: string): boolean;
/**
 * Get all mappings
 */
declare function getAllMappings(): GestureMapping[];

export { type ASTNode, CalculatorHistory, DEFAULT_GESTURE_MAPPINGS, E, GOLDEN_RATIO, type Gesture, type GestureMapping, type GestureType, type HistoryEntry, type Operation, PI, type Point, type Token, acos, add, addGestureMapping, applyOperation, asin, atan, buildAST, cos, distanceBetween, divide, evaluate, evaluateNode, evaluateWithPrecision, factorial, getAllMappings, getConstant, isOperation, ln, log, mapGesture, multiply, negate, parse, pathLength, percent, power, recognizeGesture, removeGestureMapping, resamplePoints, sin, smoothBezier, smoothMovingAverage, sqrt, subtract, tan, tokenize };
