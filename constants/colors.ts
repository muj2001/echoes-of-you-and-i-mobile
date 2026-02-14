/**
 * Color palette for Echoes of You and I
 * 
 * Design: Apple-inspired with romantic, warm tones
 * - Primary: Rose pink for love/connection
 * - Accent: Purple for depth and elegance
 * - Soft, warm neutrals for comfortable reading
 */

export const colors = {
  // Primary - Rose Pink
  primary: '#E91E63',
  primaryLight: '#F8BBD0',
  primaryDark: '#C2185B',
  primaryMuted: '#FCE4EC',

  // Accent - Purple
  accent: '#9C27B0',
  accentLight: '#E1BEE7',
  accentDark: '#7B1FA2',

  // Gradients
  gradientStart: '#E91E63',
  gradientEnd: '#9C27B0',

  // Status
  online: '#4CAF50',
  offline: '#9E9E9E',
  synced: '#E91E63',

  // Feedback
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',

  // Light theme
  light: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    textMuted: '#999999',
    border: '#E0E0E0',
    divider: '#F0F0F0',
  },

  // Dark theme
  dark: {
    background: '#0A0A0A',
    surface: '#1A1A1A',
    surfaceElevated: '#242424',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textMuted: '#666666',
    border: '#333333',
    divider: '#1F1F1F',
  },
};

// Gradient arrays for LinearGradient components
export const gradients = {
  primary: [colors.gradientStart, colors.gradientEnd] as const,
  primaryVertical: [colors.primaryLight, colors.primary] as const,
  subtle: ['#FCE4EC', '#F3E5F5'] as const,
  dark: ['#1A1A1A', '#0A0A0A'] as const,
};

export type ColorScheme = 'light' | 'dark';

export function getColors(scheme: ColorScheme) {
  return scheme === 'dark' ? colors.dark : colors.light;
}
