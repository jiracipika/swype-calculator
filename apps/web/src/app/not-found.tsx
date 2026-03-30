'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#000' }}>
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>÷</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.4px', color: '#EBEBF5', marginBottom: 8 }}>
          Undefined
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(235,235,245,0.55)', lineHeight: 1.5, letterSpacing: '-0.23px', marginBottom: 24 }}>
          This page doesn't compute. Let's divide by something real.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            height: 50, borderRadius: 14, padding: '0 32px',
            background: 'linear-gradient(135deg, #FF9500 0%, #FF6B00 100%)',
            color: '#fff', fontSize: 17, fontWeight: 600,
            boxShadow: '0 4px 14px rgba(255,149,0,0.35)',
            textDecoration: 'none',
          }}
        >
          Back to Calculator
        </Link>
      </div>
    </div>
  );
}
