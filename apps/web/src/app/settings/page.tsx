'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Settings() {
  const [decimals, setDecimals] = useState(() => {
    if (typeof window === 'undefined') return 2;
    return parseInt(localStorage.getItem('swype-decimals') || '2');
  });

  const save = (key: string, val: string) => localStorage.setItem(`swype-${key}`, val);

  return (
    <div className="page-shell">
      <div className="page-content">
        <div className="page-header">
          <Link href="/calc" className="nav-link">← Calculator</Link>
          <span className="page-title">Settings</span>
          <span style={{ width: 50 }} />
        </div>

        <div className="card">
          <h3 className="card-section-label">Display</h3>
          <div className="card-row">
            <span style={{ fontSize: 15, color: 'var(--color-text)' }}>Decimal places</span>
            <select
              value={decimals}
              onChange={e => { setDecimals(+e.target.value); save('decimals', e.target.value); }}
              className="select-field"
              style={{ width: 'auto', marginBottom: 0, fontSize: 14, padding: '6px 12px' }}
            >
              {[2, 4, 6, 8, 10].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div className="card">
          <h3 className="card-section-label">Gestures</h3>
          <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            <div>→ Swipe right: Delete last digit</div>
            <div>→ Swipe left: Clear all</div>
            <div>→ Double tap: Toggle decimal</div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-section-label">About</h3>
          <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <div>Swype Calculator v1.0</div>
            <div style={{ marginTop: 4 }}>Gesture-based calculator with scientific mode and unit converter.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
