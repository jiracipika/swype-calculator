/**
 * Apple-style history panel — frosted glass, refined typography
 */

import React from 'react';
import { HistoryEntry } from '@swype-calc/core';

export interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelectHistory?: (entry: HistoryEntry) => void;
  onClearHistory?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const formatResult = (value: number): string => {
  if (Math.abs(value) > 1e12 || (Math.abs(value) < 1e-9 && value !== 0)) {
    return value.toExponential(4);
  }
  return (Math.round(value * 1e10) / 1e10).toLocaleString('en-US', { maximumFractionDigits: 10 });
};

const formatTime = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  if (diff < 60_000)    return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(timestamp).toLocaleDateString();
};

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelectHistory,
  onClearHistory,
  isOpen = false,
  onClose,
  className = '',
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 900,
            animation: 'backdrop-appear 0.28s ease-out forwards',
          }}
        />
      )}

      {/* Panel */}
      <div
        className={className}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 'min(340px, 88vw)',
          height: '100%',
          /* Frosted glass */
          background: 'rgba(14, 14, 16, 0.92)',
          backdropFilter: 'saturate(180%) blur(28px)',
          WebkitBackdropFilter: 'saturate(180%) blur(28px)',
          borderLeft: '0.5px solid rgba(255,255,255,0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.32,0,0.67,0)',
          willChange: 'transform',
        }}
      >
        {/* Subtle top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,159,10,0.4) 40%, rgba(255,159,10,0.15) 100%)',
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '22px 20px 18px',
            paddingTop: 'max(22px, env(safe-area-inset-top))',
            borderBottom: '0.5px solid rgba(255,255,255,0.07)',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: '22px',
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
              letterSpacing: '-0.5px',
            }}
          >
            Recents
          </span>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                style={{
                  padding: '5px 14px',
                  borderRadius: '20px',
                  background: 'rgba(255,59,48,0.12)',
                  color: '#FF453A',
                  fontSize: '13px',
                  fontWeight: '500',
                  letterSpacing: '-0.1px',
                  cursor: 'default',
                  fontFamily: '-apple-system, system-ui, sans-serif',
                  transition: 'background 0.15s',
                  border: '0.5px solid rgba(255,59,48,0.2)',
                }}
                onPointerEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,59,48,0.22)';
                }}
                onPointerLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,59,48,0.12)';
                }}
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'default',
                lineHeight: 1,
                border: '0.5px solid rgba(255,255,255,0.1)',
                transition: 'background 0.15s',
              }}
              onPointerEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)';
              }}
              onPointerLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* List */}
        <div
          className="history-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 12px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {history.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: '14px',
                fontFamily: '-apple-system, system-ui, sans-serif',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                }}
              >
                ⏱
              </div>
              <div
                style={{
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.25)',
                  fontWeight: '400',
                  letterSpacing: '-0.2px',
                }}
              >
                No calculations yet
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {[...history].reverse().map((entry, index) => (
                <button
                  key={index}
                  onClick={() => onSelectHistory?.(entry)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '16px',
                    background: 'transparent',
                    textAlign: 'right',
                    width: '100%',
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '4px',
                    transition: 'background 0.12s ease-out',
                    fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
                    animation: `entry-appear 0.3s ease-out ${Math.min(index * 0.04, 0.2)}s both`,
                  }}
                  onPointerEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                  }}
                  onPointerLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  {/* Expression */}
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.35)',
                      letterSpacing: '-0.1px',
                      lineHeight: 1.3,
                    }}
                  >
                    {entry.expression}
                  </span>

                  {/* Result */}
                  <span
                    style={{
                      fontSize: '28px',
                      fontWeight: '200',
                      color: '#FFFFFF',
                      letterSpacing: '-1.5px',
                      lineHeight: 1.1,
                    }}
                  >
                    {formatResult(entry.result)}
                  </span>

                  {/* Timestamp */}
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.2)',
                      fontWeight: '400',
                      letterSpacing: '0.1px',
                    }}
                  >
                    {formatTime(entry.timestamp)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPanel;
