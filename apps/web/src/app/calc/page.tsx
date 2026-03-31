'use client';
import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

const BUTTONS = [
  ['C', '⌫', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['±', '0', '.', '='],
];

const SCI_BUTTONS = ['sin', 'cos', 'tan', 'log', 'sqrt', 'x^2', 'pi', 'e', '(', ')'];

function formatDisplay(val: string): string {
  if (val === 'Error') return 'Error';
  const num = parseFloat(val);
  if (isNaN(num)) return val;
  if (val.includes('.') && val.endsWith('.')) return val;
  if (Math.abs(num) >= 1e12) return num.toExponential(4);
  return num.toLocaleString('en-US', { maximumFractionDigits: 10 });
}

function safeEval(expr: string): string {
  try {
    const sanitized = expr
      .replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
      .replace(/π/g, Math.PI.toString()).replace(/e(?![x])/g, Math.E.toString())
      .replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(').replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(').replace(/√\(/g, 'Math.sqrt(');
    const result = new Function(`return (${sanitized})`)();
    if (!isFinite(result)) return 'Error';
    return parseFloat(result.toPrecision(12)).toString();
  } catch {
    return 'Error';
  }
}

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [sci, setSci] = useState(false);
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const input = (val: string) => {
    if (display === 'Error' || display === '0' && val !== '.') {
      setDisplay(val === '.' ? '0.' : val);
      return;
    }
    setDisplay(prev => prev + val);
  };

  const clear = () => { setDisplay('0'); setExpression(''); };
  const backspace = () => { setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0'); };

  const evaluate = () => {
    const expr = display;
    const result = safeEval(expr);
    setExpression(expr + ' =');
    setDisplay(result);
    if (result !== 'Error') setHistory(prev => [{ expr, result }, ...prev].slice(0, 50));
  };

  const handleButton = (btn: string) => {
    if (btn === 'C') return clear();
    if (btn === '⌫') return backspace();
    if (btn === '=') return evaluate();
    if (btn === '±') {
      setDisplay(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
      return;
    }
    if (btn === '%') { setDisplay(prev => (parseFloat(prev) / 100).toString()); return; }
    if (['sin', 'cos', 'tan', 'log', '√'].includes(btn)) {
      const val = parseFloat(display);
      if (isNaN(val)) return;
      const fn: Record<string, (n: number) => number> = { sin: Math.sin, cos: Math.cos, tan: Math.tan, log: Math.log10, sqrt: Math.sqrt };
      setDisplay(fn[btn](val).toPrecision(10).toString());
      return;
    }
    if (btn === 'x²') { setDisplay(prev => Math.pow(parseFloat(prev), 2).toString()); return; }
    if (btn === 'π') { setDisplay(Math.PI.toString()); return; }
    if (btn === 'e') { setDisplay(Math.E.toString()); return; }
    input(btn);
  };

  const onPointerDown = (e: React.PointerEvent) => { touchStart.current = { x: e.clientX, y: e.clientY }; };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!touchStart.current) return;
    const dx = e.clientX - touchStart.current.x;
    if (dx > 50) backspace();
    else if (dx < -50) clear();
    touchStart.current = null;
  };

  const opColor: Record<string, string> = { '÷': '#FF9500', '×': '#FF9500', '−': '#FF9500', '+': '#FF9500', '=': '#FF9500' };

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" className="nav-link">← Back</Link>
        <Link href="/history" className="nav-link">History</Link>
        <button onClick={() => setSci(!sci)} className="btn btn-ghost" style={{ fontSize: 14 }}>{sci ? 'Basic' : 'Scientific'}</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 20px 20px' }}
        onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div style={{ textAlign: 'right', marginBottom: 4, minHeight: 24, fontSize: 16, color: '#8e8e93' }}>{expression}</div>
        <div style={{ textAlign: 'right', fontSize: 56, fontWeight: 300, color: '#fff', letterSpacing: '-2px', marginBottom: 20, overflow: 'hidden' }}>
          {formatDisplay(display)}
        </div>
        <div style={{ fontSize: 12, color: '#8e8e93', marginBottom: 12 }}>← Swipe to clear · → Swipe to delete</div>

        {sci && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 8 }}>
            {SCI_BUTTONS.map(btn => (
              <button key={btn} onClick={() => handleButton(btn)} className="sci-btn">{btn}</button>
            ))}
          </div>
        )}

        {BUTTONS.map((row, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 8 }}>
            {row.map(btn => {
              const isOp = opColor[btn];
              const isTop = ri === 0 && !isOp;
              return (
                <button key={btn} onClick={() => handleButton(btn)} className="calc-btn" style={{
                  fontWeight: isOp ? 600 : 400,
                  background: isTop ? '#a5a5a5' : isOp ? '#FF9500' : '#333',
                  color: isTop ? '#000' : '#fff',
                }}>{btn}</button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
