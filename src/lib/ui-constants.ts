// UI Constants following 60/30/10 rule
export const colors = {
  // Primary (60%)
  primary: {
    DEFAULT: '#0B67FF',
    50: '#E6F0FF',
    100: '#CCE0FF',
    200: '#99C2FF',
    300: '#66A3FF',
    400: '#3385FF',
    500: '#0B67FF',
    600: '#0052CC',
    700: '#003D99',
    800: '#002966',
    900: '#001433',
  },
  // Accent (30%)
  accent: {
    DEFAULT: '#00C2A8',
    50: '#E6FAF7',
    100: '#CCF5EF',
    200: '#99EBDF',
    300: '#66E0CF',
    400: '#33D6BF',
    500: '#00C2A8',
    600: '#009B86',
    700: '#007365',
    800: '#004C43',
    900: '#002622',
  },
  // Surface colors
  surface: {
    dark: '#0F1724',
    light: '#FFFFFF',
    darkHover: '#1A2332',
    lightHover: '#F8FAFC',
  },
  // Text and muted colors (10%)
  muted: {
    DEFAULT: '#94A3B8',
    foreground: '#64748B',
    background: '#F1F5F9',
  },
  // Semantic colors
  semantic: {
    success: '#16A34A',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#0B67FF',
  },
};

// Accessibility constants
export const a11y = {
  focusRing: 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none',
  focusVisible: 'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  reducedMotion: 'motion-reduce:transition-none motion-reduce:transform-none',
  srOnly: 'sr-only',
  notSrOnly: 'not-sr-only',
  ariaLive: 'aria-live="polite"',
  ariaAtomic: 'aria-atomic="true"',
};

// Animation durations respecting prefers-reduced-motion
export const motion = {
  duration: {
    fast: 'duration-150',
    normal: 'duration-300',
    slow: 'duration-500',
  },
  reduced: 'motion-reduce:duration-[0.01ms]',
};

// Responsive breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
