/**
 * Apple-style calculator display — generous whitespace, refined typography
 */

import React, { useEffect, useRef, useState } from 'react';

export interface DisplayProps {
  expression?: string;
  result?: string | number;
  showResult?: boolean;
  className?: string;
}

const formatResult = (value: string | number): string => {
  if (typeof value === 'number') {
    if (Math.abs(value) > 1e12 || (Math.abs(value) < 1e-9 && value !== 0)) {
      return value.toExponential(4);
    }
    const rounded = Math.round(value * 1e10) / 1e10;
    return rounded.toLocaleString('en-US', { maximumFractionDigits: 10 });
  }
  return value;
};

const getResultFontSize = (text: string): number => {
  const len = text.replace(/[,\s]/g, '').length;
  if (len <= 6)  return 84;
  if (len <= 9)  return 68;
  if (len <= 12) return 54;
  if (len <= 15) return 42;
  return 32;
};

export const Display: React.FC<DisplayProps> = ({
  expression = '',
  result = '',
  showResult = false,
  className = '',
}) => {
  const formatted = showResult && result !== '' ? formatResult(result) : '0';
  const fontSize = getResultFontSize(formatted);
  const prevResult = useRef(formatted);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (formatted !== prevResult.current) {
      prevResult.current = formatted;
      setAnimKey((k) => k + 1);
    }
  }, [formatted]);

  const letterSpacing = fontSize >= 68 ? '-4px' : fontSize >= 54 ? '-2.5px' : '-1.5px';

  return (
    <div
      className={`calc-display ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        padding: '0 22px 24px',
        minHeight: '220px',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* Ambient glow behind large numbers */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '-20px',
          width: '200px',
          height: '120px',
          background: 'radial-gradient(ellipse at 80% 60%, rgba(255,159,10,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Expression row */}
      <div
        style={{
          fontSize: '22px',
          fontWeight: '300',
          color: 'rgba(255,255,255,0.38)',
          textAlign: 'right',
          lineHeight: 1.35,
          marginBottom: '6px',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
          letterSpacing: '-0.5px',
          minHeight: '30px',
          transition: 'opacity 0.2s ease-out',
          opacity: expression ? 1 : 0,
        }}
      >
        {expression || '\u00a0'}
      </div>

      {/* Result row */}
      <div
        key={animKey}
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: '200',
          color: '#FFFFFF',
          textAlign: 'right',
          lineHeight: 1,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
          letterSpacing,
          transition: 'font-size 0.22s cubic-bezier(0.25,0.8,0.25,1), letter-spacing 0.22s ease',
          animation: 'result-appear 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards',
          textShadow: '0 0 40px rgba(255,255,255,0.06)',
        }}
      >
        {formatted}
      </div>
    </div>
  );
};

export default Display;
