/**
 * Apple-style calculator button — dainty, gradient, 20px radius
 */

import React, { useState, useRef, useCallback } from 'react';

export interface ButtonProps {
  value: string;
  onPress?: () => void;
  onLongPress?: () => void;
  type?: 'number' | 'operator' | 'function' | 'special';
  active?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const SCHEMES = {
  number: {
    bg:      'linear-gradient(175deg, #3E3E42 0%, #2A2A2D 100%)',
    pressed: 'linear-gradient(175deg, #5A5A5E 0%, #484849 100%)',
    text:    '#FFFFFF',
    shadow:  '0 2px 8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
    shadowPressed: 'inset 0 2px 5px rgba(0,0,0,0.4)',
  },
  operator: {
    bg:      'linear-gradient(175deg, #FFAC1C 0%, #FF9500 100%)',
    pressed: 'linear-gradient(175deg, #FFB830 0%, #E88600 100%)',
    text:    '#FFFFFF',
    shadow:  '0 2px 12px rgba(255,149,0,0.28), inset 0 1px 0 rgba(255,255,255,0.28)',
    shadowPressed: '0 1px 4px rgba(255,149,0,0.15), inset 0 2px 5px rgba(0,0,0,0.15)',
  },
  function: {
    bg:      'linear-gradient(175deg, #6C6C70 0%, #545456 100%)',
    pressed: 'linear-gradient(175deg, #888888 0%, #6E6E72 100%)',
    text:    '#FFFFFF',
    shadow:  '0 2px 8px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',
    shadowPressed: 'inset 0 2px 5px rgba(0,0,0,0.35)',
  },
  special: {
    bg:      'linear-gradient(175deg, #6C6C70 0%, #545456 100%)',
    pressed: 'linear-gradient(175deg, #888888 0%, #6E6E72 100%)',
    text:    '#FFFFFF',
    shadow:  '0 2px 8px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',
    shadowPressed: 'inset 0 2px 5px rgba(0,0,0,0.35)',
  },
} as const;

export const Button: React.FC<ButtonProps> = ({
  value,
  onPress,
  onLongPress,
  type = 'number',
  active = false,
  disabled = false,
  className = '',
  style = {},
  children,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [justReleased, setJustReleased] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout>>();
  const didLongPress = useRef(false);

  const scheme = SCHEMES[type] ?? SCHEMES.number;

  const getBackground = () => {
    if (disabled) return '#1C1C1E';
    if (active)   return '#FFFFFF';
    if (isPressed) return scheme.pressed;
    return scheme.bg;
  };

  const getColor = () => {
    if (disabled) return '#48484A';
    if (active)   return type === 'operator' ? '#FF9500' : '#1C1C1E';
    return scheme.text;
  };

  const getBoxShadow = () => {
    if (disabled) return 'none';
    if (active && type === 'operator') return '0 0 18px rgba(255,149,0,0.35)';
    if (isPressed) return scheme.shadowPressed;
    return scheme.shadow;
  };

  const getFontSize = () => {
    if (type === 'number') return '28px';
    if (value.length > 2) return '16px';
    return '22px';
  };

  const getFontWeight = () => {
    if (type === 'number') return '300';
    if (type === 'operator') return '400';
    return '400';
  };

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    didLongPress.current = false;
    setIsPressed(true);
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onLongPress?.();
      setIsPressed(false);
    }, 500);
  }, [disabled, onLongPress]);

  const handlePointerUp = useCallback(() => {
    if (disabled) return;
    clearTimeout(longPressTimer.current);
    setIsPressed(false);
    if (!didLongPress.current) {
      setJustReleased(true);
      onPress?.();
      setTimeout(() => setJustReleased(false), 380);
    }
  }, [disabled, onPress]);

  const handlePointerCancel = useCallback(() => {
    clearTimeout(longPressTimer.current);
    setIsPressed(false);
  }, []);

  const transform = isPressed ? 'scale(0.93)' : 'scale(1)';

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      disabled={disabled}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20px',
        fontSize: getFontSize(),
        fontWeight: getFontWeight(),
        fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
        letterSpacing: type === 'number' ? '-0.5px' : '-0.2px',
        height: '100%',
        width: '100%',
        background: getBackground(),
        color: getColor(),
        boxShadow: getBoxShadow(),
        transform,
        animation: justReleased ? 'ios-spring 0.38s cubic-bezier(0.34,1.56,0.64,1) forwards' : undefined,
        transition: isPressed
          ? 'transform 0.07s ease-out, box-shadow 0.07s ease-out'
          : 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease-out, background 0.15s ease-out',
        willChange: 'transform',
        ...style,
      }}
    >
      {children || value}
    </button>
  );
};

export default Button;
