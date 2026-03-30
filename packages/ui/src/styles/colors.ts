/**
 * Color palette for Swype Calculator
 * Apple dainty aesthetic
 */

export const colors = {
  bg: {
    primary: 'rgba(255, 255, 255, 0.8)',
    secondary: 'rgba(255, 255, 255, 0.6)',
    glass: 'rgba(255, 255, 255, 0.4)',
    dark: 'rgba(30, 30, 32, 0.9)',
    darkGlass: 'rgba(30, 30, 32, 0.6)',
  },
  accent: {
    blue: '#007AFF',
    pink: '#FF2D55',
    green: '#34C759',
    orange: '#FF9500',
    purple: '#AF52DE',
    teal: '#5AC8FA',
  },
  text: {
    primary: '#1C1C1E',
    secondary: '#8E8E93',
    dark: '#FFFFFF',
    darkSecondary: '#AEAEB2',
  },
  trail: {
    default: 'rgba(0, 122, 255, 0.6)',
    blue: 'rgba(0, 122, 255, 0.8)',
    pink: 'rgba(255, 45, 85, 0.8)',
    green: 'rgba(52, 199, 89, 0.8)',
  },
  button: {
    normal: 'rgba(255, 255, 255, 0.6)',
    active: 'rgba(255, 255, 255, 0.8)',
    operator: 'rgba(240, 240, 245, 0.9)',
    function: 'rgba(230, 230, 235, 0.9)',
  },
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export type ColorKey = keyof typeof colors;
