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
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '16px 16px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Link href="/calc" style={{ fontSize: 14, color: '#8e8e93' }}>← Calculator</Link>
          <span style={{ fontSize: 15, color: '#fff', fontWeight: 600 }}>History</span>
          <button onClick={() => setShowClear(true)} style={{ background: 'none', border: 'none', fontSize: 14, color: '#ff3b30', cursor: 'pointer' }}>Clear</button>
        </div>

        <input type="text" placeholder="Search calculations..." value={search} onChange={e => setSearch(e.target.value)} style={{
          width: '100%', padding: '10px 14px', borderRadius: 10, border: 'none', fontSize: 15,
          background: '#1c1c1e', color: '#fff', marginBottom: 20, outline: 'none',
        }} />

        {showClear && (
          <div style={{ padding: 16, borderRadius: 14, background: '#1c1c1e', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#fff' }}>Clear all history?</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowClear(false)} style={{ padding: '8px 16px', borderRadius: 8, background: '#333', border: 'none', color: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={clearAll} style={{ padding: '8px 16px', borderRadius: 8, background: '#ff3b30', border: 'none', color: '#fff', cursor: 'pointer' }}>Clear</button>
            </div>
          </div>
        )}

        {Object.entries(groups).map(([label, entries]) => (
          <div key={label}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#8e8e93', marginBottom: 8, marginTop: 16 }}>{label}</div>
            {entries.map(h => (
              <div key={h.id} onClick={() => copy(h.result, h.id)} style={{
                padding: '12px 14px', borderRadius: 12, background: '#1c1c1e', marginBottom: 6, cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 15, color: '#fff' }}>{h.expression}</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: copied === h.id ? '#34c759' : '#fff' }}>
                    = {h.result} {copied === h.id ? '✓' : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={e => { e.stopPropagation(); togglePin(h.id); }} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>
                    {h.pinned ? '📌' : '📍'}
                  </button>
                  <button onClick={e => { e.stopPropagation(); deleteEntry(h.id); }} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: '#ff3b30' }}>×</button>
                </div>
              </div>
            ))}
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#8e8e93' }}>
            {search ? 'No matching calculations' : 'No history yet. Start calculating!'}
          </div>
        )}
      </div>
    </div>
  );
}
