/**
 * History management for calculator
 */

export interface HistoryEntry {
  expression: string;
  result: number;
  timestamp: number;
}

export class CalculatorHistory {
  private entries: HistoryEntry[] = [];
  private maxSize: number;

  constructor(maxSize = 50) {
    this.maxSize = maxSize;
  }

  add(expression: string, result: number): void {
    const entry: HistoryEntry = {
      expression,
      result,
      timestamp: Date.now(),
    };
    this.entries.unshift(entry);
    if (this.entries.length > this.maxSize) {
      this.entries.pop();
    }
  }

  getAll(): HistoryEntry[] {
    return [...this.entries];
  }

  getRecent(count: number): HistoryEntry[] {
    return this.entries.slice(0, count);
  }

  clear(): void {
    this.entries = [];
  }

  get(index: number): HistoryEntry | undefined {
    return this.entries[index];
  }

  size(): number {
    return this.entries.length;
  }

  undo(): HistoryEntry | undefined {
    return this.entries.shift();
  }

  getLast(): HistoryEntry | undefined {
    return this.entries[0];
  }
}
