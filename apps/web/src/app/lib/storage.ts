export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  pinned?: boolean;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  decimalPlaces: number;
  hapticFeedback: boolean;
  gestureHints: boolean;
  scientificMode: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  decimalPlaces: 10,
  hapticFeedback: true,
  gestureHints: true,
  scientificMode: false,
};

export function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('swype-history');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('swype-history', JSON.stringify(entries));
  } catch {
    // Storage full or unavailable
  }
}

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
  try {
    const raw = localStorage.getItem('swype-settings');
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed } as AppSettings;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('swype-settings', JSON.stringify(settings));
  } catch {
    // Storage full or unavailable
  }
}
