'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface Tab {
  label: string;
  href: string;
  icon: React.ReactNode;
}

function CalcIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="3" width="16" height="16" rx="3" stroke={active ? '#FF9F0A' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5" />
      <rect x="6" y="6" width="3" height="2" rx="0.5" fill={active ? '#FF9F0A' : 'rgba(255,255,255,0.35)'} />
      <rect x="10" y="6" width="3" height="2" rx="0.5" fill={active ? '#FF9F0A' : 'rgba(255,255,255,0.35)'} />
      <rect x="14" y="6" width="2" height="2" rx="0.5" fill={active ? '#FF9F0A' : 'rgba(255,255,255,0.35)'} />
      <rect x="6" y="10" width="3" height="2" rx="0.5" fill={active ? '#FF9F0A' : 'rgba(255,255,255,0.35)'} />
      <rect x="10" y="10" width="3" height="2" rx="0.5" fill={active ? '#FF9F0A' : 'rgba(255,255,255,0.35)'} />
      <rect x="14" y="10" width="2" height="2" rx="0.5" fill={active ? '#FF9F0A' : 'rgba(255,255,255,0.35)'} />
      <rect x="6" y="14" width="10" height="2" rx="0.5" fill={active ? '#FF9F0A' : 'rgba(255,255,255,0.35)'} />
    </svg>
  );
}

function HistoryIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="7.5" stroke={active ? '#FF9F0A' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5" />
      <path d="M11 7.5v4l2.5 2" stroke={active ? '#FF9F0A' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ConvertIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M4 8h14M14 5l3 3-3 3" stroke={active ? '#FF9F0A' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 14H4M8 11l-3 3 3 3" stroke={active ? '#FF9F0A' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="2.5" stroke={active ? '#FF9F0A' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5" />
      <path
        d="M11 3.5v2M11 16.5v2M3.5 11h2M16.5 11h2M5.55 5.55l1.41 1.41M15.04 15.04l1.41 1.41M5.55 16.45l1.41-1.41M15.04 6.96l1.41-1.41"
        stroke={active ? '#FF9F0A' : 'rgba(255,255,255,0.35)'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const [pressedTab, setPressedTab] = useState<string | null>(null);

  const tabs: Tab[] = [
    {
      label: 'Calculator',
      href: '/calc',
      icon: null,
    },
    {
      label: 'History',
      href: '/history',
      icon: null,
    },
    {
      label: 'Convert',
      href: '/convert',
      icon: null,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: null,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/calc' && (pathname === '/' || pathname === '/calc')) return true;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '390px',
        background: 'rgba(28,28,30,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '0.5px solid rgba(255,255,255,0.1)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      {tabs.map(({ label, href }) => {
        const active = isActive(href);
        const pressed = pressedTab === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '10px',
              paddingBottom: '10px',
              gap: '4px',
              textDecoration: 'none',
              transform: pressed ? 'scale(0.88)' : 'scale(1)',
              transition: pressed ? 'none' : 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              position: 'relative',
            }}
            onPointerDown={() => setPressedTab(href)}
            onPointerUp={() => setPressedTab(null)}
            onPointerCancel={() => setPressedTab(null)}
            onPointerLeave={() => setPressedTab(null)}
          >
            {/* Active dot indicator */}
            {active && (
              <div
                style={{
                  position: 'absolute',
                  top: '6px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '2px',
                  background: '#FF9F0A',
                }}
              />
            )}

            {/* Icon */}
            <div style={{ marginTop: active ? '4px' : '0' }}>
              {label === 'Calculator' && <CalcIcon active={active} />}
              {label === 'History' && <HistoryIcon active={active} />}
              {label === 'Convert' && <ConvertIcon active={active} />}
              {label === 'Settings' && <SettingsIcon active={active} />}
            </div>

            {/* Label */}
            <span
              style={{
                fontSize: '10px',
                fontWeight: 500,
                color: active ? '#FF9F0A' : 'rgba(255,255,255,0.35)',
                fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
                lineHeight: 1,
                letterSpacing: '0.2px',
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
