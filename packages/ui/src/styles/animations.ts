/**
 * Animation configurations
 */

export const easings = {
  smooth: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

export const durations = {
  fast: 150,
  normal: 300,
  slow: 400,
  trail: 16, // ~60fps
};

export const animations = {
  buttonPress: {
    duration: durations.fast,
    easing: easings.spring,
  },
  modeToggle: {
    duration: durations.normal,
    easing: easings.smooth,
  },
  historyPanel: {
    duration: durations.slow,
    easing: easings.smooth,
  },
  trailDraw: {
    duration: durations.trail,
    easing: 'linear',
  },
  resultUpdate: {
    duration: durations.normal,
    easing: easings.easeOut,
  },
};

export const keyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  scaleIn: {
    from: { transform: 'scale(0.95)' },
    to: { transform: 'scale(1)' },
  },
  slideUp: {
    from: { transform: 'translateY(100%)' },
    to: { transform: 'translateY(0)' },
  },
  slideDown: {
    from: { transform: 'translateY(0)' },
    to: { transform: 'translateY(100%)' },
  },
};
