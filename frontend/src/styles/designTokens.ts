/**
 * Design Tokens - Design System
 *
 * Sistema centralizado de tokens de design para garantir consistência
 * visual em toda a aplicação.
 */

// Paleta de cores moderna e profissional
export const colors = {
  // Primary - Azul moderno e confiável
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',  // Main
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },

  // Secondary - Roxo premium
  secondary: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#9C27B0',  // Main
    600: '#8E24AA',
    700: '#7B1FA2',
    800: '#6A1B9A',
    900: '#4A148C',
  },

  // Success - Verde vibrante
  success: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',  // Main
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  // Warning - Âmbar chamativo
  warning: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FFC107',  // Main
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },

  // Error - Vermelho assertivo
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336',  // Main
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },

  // Info - Ciano informativo
  info: {
    50: '#E1F5FE',
    100: '#B3E5FC',
    200: '#81D4FA',
    300: '#4FC3F7',
    400: '#29B6F6',
    500: '#03A9F4',  // Main
    600: '#039BE5',
    700: '#0288D1',
    800: '#0277BD',
    900: '#01579B',
  },

  // Grayscale
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Cores especiais
  white: '#FFFFFF',
  black: '#000000',

  // Gradientes
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    warm: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    cool: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    sunset: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
    ocean: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    barber: 'linear-gradient(135deg, #1976D2 0%, #9C27B0 100%)',  // Tema da barbearia
  },

  // Backgrounds
  background: {
    default: '#F5F7FA',
    paper: '#FFFFFF',
    dark: '#0A1929',
    darkPaper: '#1A2027',
  },
};

// Typography - Sistema de tipografia
export const typography = {
  fontFamily: {
    primary: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    secondary: '"Poppins", sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },

  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
};

// Spacing - Sistema de espaçamento consistente (baseado em 8px)
export const spacing = {
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
  40: '10rem',      // 160px
  48: '12rem',      // 192px
  56: '14rem',      // 224px
  64: '16rem',      // 256px
};

// Border radius
export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  base: '0.5rem',   // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  full: '9999px',
};

// Shadows - Sistema de sombras
export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // Sombras coloridas
  primaryGlow: '0 10px 40px rgba(33, 150, 243, 0.3)',
  secondaryGlow: '0 10px 40px rgba(156, 39, 176, 0.3)',
  successGlow: '0 10px 40px rgba(76, 175, 80, 0.3)',

  // Glassmorphism
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
};

// Transitions - Animações suaves
export const transitions = {
  duration: {
    fastest: '100ms',
    faster: '150ms',
    fast: '200ms',
    normal: '300ms',
    slow: '400ms',
    slower: '500ms',
    slowest: '600ms',
  },

  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Easings especiais
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
};

// Z-index - Camadas consistentes
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
  max: 9999,
};

// Breakpoints - Responsividade
export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
};

// Grid
export const grid = {
  columns: 12,
  gutter: spacing[4],
  container: {
    xs: '100%',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },
};

// Opacities
export const opacity = {
  disabled: 0.38,
  hover: 0.04,
  selected: 0.08,
  focus: 0.12,
  activated: 0.12,
};

// Icon sizes
export const iconSize = {
  xs: '16px',
  sm: '20px',
  base: '24px',
  lg: '32px',
  xl: '48px',
  '2xl': '64px',
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  grid,
  opacity,
  iconSize,
};
