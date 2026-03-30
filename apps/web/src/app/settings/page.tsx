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
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Link href="/calc" style={{ fontSize: 14, color: '#8e8e93' }}>← Calculator</Link>
          <span style={{ fontSize: 15, color: '#fff', fontWeight: 600 }}>Settings</span>
          <span style={{ width: 50 }} />
        </div>

        <div style={{ padding: 16, borderRadius: 14, background: '#1c1c1e', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#8e8e93', textTransform: 'uppercase', marginBottom: 12 }}>Display</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <span style={{ fontSize: 15, color: '#fff' }}>Decimal places</span>
            <select value={decimals} onChange={e => { setDecimals(+e.target.value); save('decimals', e.target.value); }} style={{
              padding: '6px 12px', borderRadius: 8, border: 'none', fontSize: 14, background: '#2c2c2e', color: '#fff',
            }}>
              {[2, 4, 6, 8, 10].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div style={{ padding: 16, borderRadius: 14, background: '#1c1c1e', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#8e8e93', textTransform: 'uppercase', marginBottom: 12 }}>Gestures</h3>
          <div style={{ padding: '8px 0', fontSize: 14, color: '#8e8e93', lineHeight: 1.6 }}>
            <div>→ Swipe right: Delete last digit</div>
            <div>→ Swipe left: Clear all</div>
            <div>→ Double tap: Toggle decimal</div>
          </div>
        </div>

        <div style={{ padding: 16, borderRadius: 14, background: '#1c1c1e' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#8e8e93', textTransform: 'uppercase', marginBottom: 12 }}>About</h3>
          <div style={{ padding: '8px 0', fontSize: 14, color: '#8e8e93' }}>
            <div>Swype Calculator v1.0</div>
            <div style={{ marginTop: 4 }}>Gesture-based calculator with scientific mode and unit converter.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
