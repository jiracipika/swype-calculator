'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const CATEGORIES: Record<string, { name: string; emoji: string; units: string[] }[]> = {
  Length: [{ name: 'Meters', emoji: '📏', units: ['m', 'km', 'cm', 'mm', 'mi', 'yd', 'ft', 'in'] }],
  Weight: [{ name: 'Kilograms', emoji: '⚖️', units: ['kg', 'g', 'mg', 'lb', 'oz', 't'] }],
  Temperature: [{ name: 'Celsius', emoji: '🌡️', units: ['°C', '°F', 'K'] }],
  Volume: [{ name: 'Liters', emoji: '🧪', units: ['L', 'mL', 'gal', 'qt', 'pt', 'cup', 'fl oz'] }],
  Speed: [{ name: 'm/s', emoji: '🏎️', units: ['m/s', 'km/h', 'mph', 'knot', 'ft/s'] }],
  Time: [{ name: 'Seconds', emoji: '⏱️', units: ['s', 'min', 'h', 'd', 'wk', 'mo', 'yr'] }],
  Data: [{ name: 'Bytes', emoji: '💾', units: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] }],
};

const RATES: Record<string, number> = {
  // Length (base: meters)
  m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254,
  // Weight (base: kg)
  kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, t: 1000,
  // Volume (base: liters)
  L: 1, mL: 0.001, gal: 3.78541, qt: 0.946353, pt: 0.473176, cup: 0.24, 'fl oz': 0.0295735,
  // Speed (base: m/s)
  'm/s': 1, 'km/h': 0.277778, mph: 0.44704, knot: 0.514444, 'ft/s': 0.3048,
  // Time (base: seconds)
  s: 1, min: 60, h: 3600, d: 86400, wk: 604800, mo: 2592000, yr: 31536000,
  // Data (base: bytes)
  B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776, PB: 1125899906842624,
};

function convertTemp(val: number, from: string, to: string): number {
  let c = val;
  if (from === '°F') c = (val - 32) * 5/9;
  else if (from === 'K') c = val - 273.15;
  if (to === '°C') return c;
  if (to === '°F') return c * 9/5 + 32;
  if (to === 'K') return c + 273.15;
  return c;
}

function convert(val: number, from: string, to: string, cat: string): number {
  if (cat === 'Temperature') return convertTemp(val, from, to);
  const base = val * (RATES[from] || 1);
  return base / (RATES[to] || 1);
}

export default function Converter() {
  const [cat, setCat] = useState('Length');
  const units = Object.values(CATEGORIES[cat])[0].units;
  const [from, setFrom] = useState(units[0]);
  const [to, setTo] = useState(units[1]);
  const [value, setValue] = useState('1');
  const [recent, setRecent] = useState<{ cat: string; from: string; to: string; val: string; result: string }[]>([]);

  useEffect(() => {
    try { setRecent(JSON.parse(localStorage.getItem('swype-recent-conv') || '[]')); } catch {}
  }, []);

  const result = value ? convert(parseFloat(value) || 0, from, to, cat) : 0;
  const swap = () => { setFrom(to); setTo(from); };
  const handleCatChange = (c: string) => {
    setCat(c);
    const u = Object.values(CATEGORIES[c])[0].units;
    setFrom(u[0]); setTo(u[1]); setValue('1');
  };

  const saveRecent = () => {
    if (!value) return;
    const entry = { cat, from, to, val: value, result: result.toPrecision(6) };
    const next = [entry, ...recent.filter(r => !(r.from === from && r.to === to && r.cat === cat))].slice(0, 5);
    setRecent(next);
    localStorage.setItem('swype-recent-conv', JSON.stringify(next));
  };

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <Link href="/calc" style={{ fontSize: 14, color: '#8e8e93' }}>← Calculator</Link>
          <span style={{ fontSize: 15, color: '#fff', fontWeight: 600 }}>Converter</span>
          <span style={{ width: 50 }} />
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {Object.keys(CATEGORIES).map(c => (
            <button key={c} onClick={() => handleCatChange(c)} style={{
              padding: '6px 12px', borderRadius: 10, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              background: cat === c ? '#fff' : '#1c1c1e', color: cat === c ? '#000' : '#8e8e93',
            }}>{Object.values(CATEGORIES[c])[0].emoji} {c}</button>
          ))}
        </div>

        <div style={{ padding: 20, borderRadius: 16, background: '#1c1c1e', marginBottom: 12 }}>
          <select value={from} onChange={e => setFrom(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 10, border: 'none', fontSize: 16, background: '#2c2c2e', color: '#fff', marginBottom: 8, appearance: 'none' }}>
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <input type="number" value={value} onChange={e => setValue(e.target.value)} style={{
            width: '100%', padding: 12, borderRadius: 10, border: 'none', fontSize: 28, fontWeight: 600,
            background: '#2c2c2e', color: '#fff', outline: 'none',
          }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <button onClick={swap} style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: '#007aff', color: '#fff', fontSize: 20, cursor: 'pointer' }}>⇅</button>
        </div>

        <div style={{ padding: 20, borderRadius: 16, background: '#1c1c1e', marginBottom: 20 }}>
          <select value={to} onChange={e => setTo(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 10, border: 'none', fontSize: 16, background: '#2c2c2e', color: '#fff', marginBottom: 8, appearance: 'none' }}>
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <div style={{ padding: 12, borderRadius: 10, background: '#2c2c2e', fontSize: 28, fontWeight: 600, color: '#34c759' }}>
            {value ? result.toPrecision(6) : '0'} <span style={{ fontSize: 16, color: '#8e8e93' }}>{to}</span>
          </div>
        </div>

        {recent.length > 0 && (
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#8e8e93', marginBottom: 8 }}>Recent</h3>
            {recent.map((r, i) => (
              <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: '#1c1c1e', marginBottom: 6, fontSize: 14, color: '#fff' }}>
                {r.val} {r.from} → {r.result} {r.to}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
