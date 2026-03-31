'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CalcEntry { id: string; expression: string; result: string; timestamp: number; pinned: boolean; }

const STORAGE_KEY = 'swype-calc-history';

function loadHistory(): CalcEntry[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveHistory(h: CalcEntry[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(h)); }

function groupLabel(ts: number): string {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const d = new Date(ts); d.setHours(0, 0, 0, 0);
  const diff = (now.getTime() - d.getTime()) / 86400000;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return 'Earlier';
}

export default function CalcHistory() {
  const [history, setHistory] = useState<CalcEntry[]>([]);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [showClear, setShowClear] = useState(false);

  useEffect(() => { setHistory(loadHistory()); }, []);

  const filtered = search
    ? history.filter(h => h.expression.includes(search) || h.result.includes(search))
    : history;

  const groups: Record<string, CalcEntry[]> = {};
  filtered.forEach(h => { const label = groupLabel(h.timestamp); (groups[label] ??= []).push(h); });

  const togglePin = (id: string) => {
    const next = history.map(h => h.id === id ? { ...h, pinned: !h.pinned } : h);
    setHistory(next); saveHistory(next);
  };

  const deleteEntry = (id: string) => {
    const next = history.filter(h => h.id !== id);
    setHistory(next); saveHistory(next);
  };

  const clearAll = () => { setHistory([]); saveHistory([]); setShowClear(false); };
  const copy = (text: string, id: string) => { navigator.clipboard?.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 1500); };

  return (
    <div className="page-shell">
      <div className="page-content">
        <div className="page-header">
          <Link href="/calc" className="nav-link">← Calculator</Link>
          <span className="page-title">History</span>
          <button onClick={() => setShowClear(true)} className="btn btn-danger" style={{ fontSize: 14 }}>Clear</button>
        </div>

        <input
          type="text"
          placeholder="Search calculations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="text-input"
        />

        {showClear && (
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: 'var(--color-text)' }}>Clear all history?</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowClear(false)} className="btn btn-filled">Cancel</button>
              <button onClick={clearAll} className="btn" style={{ background: 'var(--color-red)', color: '#fff' }}>Clear</button>
            </div>
          </div>
        )}

        {Object.entries(groups).map(([label, entries]) => (
          <div key={label}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8, marginTop: 16 }}>{label}</div>
            {entries.map(h => (
              <div key={h.id} onClick={() => copy(h.result, h.id)} className="history-entry">
                <div>
                  <div style={{ fontSize: 15, color: 'var(--color-text)' }}>{h.expression}</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: copied === h.id ? 'var(--color-green)' : 'var(--color-text)', transition: 'color 0.2s ease-out' }}>
                    = {h.result} {copied === h.id ? '✓' : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={e => { e.stopPropagation(); togglePin(h.id); }} className="btn btn-ghost" style={{ fontSize: 16, padding: '4px 8px' }}>
                    {h.pinned ? '📌' : '📍'}
                  </button>
                  <button onClick={e => { e.stopPropagation(); deleteEntry(h.id); }} className="btn btn-danger" style={{ fontSize: 18, fontWeight: 700, padding: '4px 8px' }}>×</button>
                </div>
              </div>
            ))}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state">
            {search ? 'No matching calculations' : 'No history yet. Start calculating!'}
          </div>
        )}
      </div>
    </div>
  );
}
