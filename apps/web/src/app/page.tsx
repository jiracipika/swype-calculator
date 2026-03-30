'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useCalculator } from '@swype-calc/ui';
import { Display, CalculatorGrid, createDefaultGridItems, HistoryPanel } from '@swype-calc/ui';
import { useSwipe } from '@swype-calc/ui';
import { Point } from '@swype-calc/core';
import { mapGesture } from '@swype-calc/core';

// ─── Swipe trail helpers ──────────────────────────────────────────────────────

function buildSmoothPath(pts: Point[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const xc = (pts[i].x + pts[i + 1].x) / 2;
    const yc = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x} ${pts[i].y} ${xc} ${yc}`;
  }
  d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
  return d;
}

const PARTICLE_STEP = 6;

// ─── History toggle button ────────────────────────────────────────────────────

function HistoryButton({
  hasHistory,
  onClick,
}: {
  hasHistory: boolean;
  onClick: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => { setPressed(false); onClick(); }}
      onPointerCancel={() => setPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: pressed
          ? 'rgba(255,255,255,0.12)'
          : hasHistory
          ? 'rgba(255,159,10,0.14)'
          : 'rgba(255,255,255,0.07)',
        color: hasHistory ? '#FF9F0A' : 'rgba(255,255,255,0.35)',
        transition: 'background 0.15s ease-out, color 0.2s ease-out',
        transform: pressed ? 'scale(0.92)' : 'scale(1)',
        border: hasHistory ? '0.5px solid rgba(255,159,10,0.25)' : '0.5px solid rgba(255,255,255,0.08)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M8 5v3.5l2.2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

// ─── Gesture hint pill ────────────────────────────────────────────────────────

function GestureHints() {
  const hints: Array<{ symbol: string; label: string }> = [
    { symbol: '→', label: 'Add' },
    { symbol: '←', label: 'Sub' },
    { symbol: '↑', label: 'Mul' },
    { symbol: '↓', label: 'Div' },
    { symbol: '◯', label: '=' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px 20px',
        paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
        flexShrink: 0,
        animation: 'hint-pulse 4s ease-in-out infinite',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '24px',
          padding: '7px 14px',
          border: '0.5px solid rgba(255,255,255,0.07)',
        }}
      >
        {hints.map(({ symbol, label }, i) => (
          <React.Fragment key={label}>
            {i > 0 && (
              <div
                style={{
                  width: '0.5px',
                  height: '14px',
                  background: 'rgba(255,255,255,0.1)',
                  margin: '0 10px',
                }}
              />
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  color: 'rgba(100,160,255,0.7)',
                  lineHeight: 1,
                  fontWeight: '400',
                }}
              >
                {symbol}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.22)',
                  fontFamily: '-apple-system, system-ui, sans-serif',
                  letterSpacing: '0.2px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                }}
              >
                {label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const {
    expression,
    result,
    showResult,
    history,
    error,
    handleInput,
    useFromHistory,
    clearHistory,
  } = useCalculator();

  const [showHistory, setShowHistory] = useState(false);
  const [swipePoints, setSwipePoints] = useState<Point[]>([]);
  const [isFading, setIsFading] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>();

  // ── Swipe handlers ────────────────────────────────────────────────────────
  const swipeHandlers = useSwipe({
    onSwipeStart: () => {
      clearTimeout(fadeTimer.current);
      setIsFading(false);
      setSwipePoints([]);
    },
    onSwipeMove: (points) => {
      setSwipePoints(points);
    },
    onSwipeEnd: (gesture) => {
      if (gesture) {
        const operation = mapGesture(gesture);
        if (operation) handleInput(operation);
      }
      setIsFading(true);
      fadeTimer.current = setTimeout(() => {
        setSwipePoints([]);
        setIsFading(false);
      }, 600);
    },
  });

  // ── Keyboard support ──────────────────────────────────────────────────────
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      const k = e.key;
      if (k >= '0' && k <= '9') return handleInput(k);
      if (k === '.')  return handleInput('.');
      if (k === '+' || k === '-') return handleInput(k);
      if (k === '*')  return handleInput('×');
      if (k === '/')  { e.preventDefault(); return handleInput('÷'); }
      if (k === 'Enter' || k === '=') { e.preventDefault(); return handleInput('='); }
      if (k === 'Escape' || k === 'c' || k === 'C') return handleInput('C');
      if (k === 'Backspace') return handleInput('⌫');
      if (k === '(' || k === ')') return handleInput(k);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // ── Trail path ────────────────────────────────────────────────────────────
  const trailPath    = buildSmoothPath(swipePoints);
  const showTrail    = swipePoints.length > 1;
  const trailOpacity = isFading ? 0 : 1;
  const lastPt       = swipePoints[swipePoints.length - 1];
  const particles    = swipePoints.filter((_, i) => i % PARTICLE_STEP === 0);

  const gridItems = createDefaultGridItems();

  return (
    <main
      className="calc-root"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '390px',
        minHeight: '100vh',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        minHeight: '100dvh',
        margin: '0 auto',
        background: '#000000',
        overflow: 'hidden',
      }}
      {...swipeHandlers}
    >
      {/* Subtle top atmosphere glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '280px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(28,28,58,0.7) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Swipe trail SVG ──────────────────────────────────────────────── */}
      {showTrail && (
        <svg
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 500,
            opacity: trailOpacity,
            transition: isFading ? 'opacity 0.55s ease-out' : 'none',
          }}
        >
          <defs>
            <filter id="trail-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="0 0 0 0 0.05   0 0.5 1 0 0   0 0 1 0 0   0 0 0 1.4 0"
                result="glow"
              />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="trail-halo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
            </filter>
          </defs>

          {/* Halo */}
          <path
            d={trailPath}
            fill="none"
            stroke="rgba(0,122,255,0.14)"
            strokeWidth="28"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#trail-halo)"
          />

          {/* Core glow line */}
          <path
            d={trailPath}
            fill="none"
            stroke="rgba(0,122,255,0.65)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#trail-glow)"
          />

          {/* Bright center */}
          <path
            d={trailPath}
            fill="none"
            stroke="rgba(140,210,255,0.92)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Particle dots */}
          {particles.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={2}
              fill="rgba(0,122,255,0.45)"
              filter="url(#trail-glow)"
            />
          ))}

          {/* Leading orb */}
          {lastPt && (
            <>
              <circle
                cx={lastPt.x}
                cy={lastPt.y}
                r={12}
                fill="rgba(0,122,255,0.1)"
                filter="url(#trail-halo)"
              />
              <circle
                cx={lastPt.x}
                cy={lastPt.y}
                r={5}
                fill="rgba(0,122,255,0.75)"
                filter="url(#trail-glow)"
              />
              <circle
                cx={lastPt.x}
                cy={lastPt.y}
                r={2}
                fill="rgba(200,235,255,1)"
              />
            </>
          )}
        </svg>
      )}

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '14px 18px 0',
          paddingTop: 'max(14px, env(safe-area-inset-top))',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <HistoryButton
          hasHistory={history.length > 0}
          onClick={() => setShowHistory(true)}
        />
      </div>

      {/* ── Display ──────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {error && (
          <div
            style={{
              margin: '0 20px 10px',
              padding: '10px 16px',
              borderRadius: '14px',
              background: 'rgba(255,59,48,0.12)',
              color: '#FF453A',
              fontSize: '13px',
              fontFamily: '-apple-system, system-ui, sans-serif',
              letterSpacing: '-0.1px',
              border: '0.5px solid rgba(255,59,48,0.2)',
              animation: 'result-appear 0.2s ease-out forwards',
            }}
          >
            {error}
          </div>
        )}
        <Display
          expression={expression}
          result={result}
          showResult={showResult}
        />
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div
        style={{
          height: '0.5px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent 100%)',
          margin: '0 18px',
          flexShrink: 0,
        }}
      />

      {/* ── Buttons ──────────────────────────────────────────────────────── */}
      <CalculatorGrid
        items={gridItems}
        onButtonPress={handleInput}
        onButtonLongPress={(value) => {
          if (value === 'C') clearHistory();
        }}
        gap="10px"
      />

      {/* ── Gesture hints ────────────────────────────────────────────────── */}
      <GestureHints />

      {/* ── History panel ────────────────────────────────────────────────── */}
      <HistoryPanel
        isOpen={showHistory}
        history={history}
        onSelectHistory={(entry) => {
          useFromHistory(entry);
          setShowHistory(false);
        }}
        onClearHistory={clearHistory}
        onClose={() => setShowHistory(false)}
      />
    </main>
  );
}
