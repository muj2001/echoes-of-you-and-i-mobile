/**
 * Spacing system for Echoes of You and I
 * 
 * Based on an 8pt grid system for consistent layouts
 * Apple-inspired generous whitespace
 */

// Base spacing unit (8pt)
const BASE = 8;

export const spacing = {
  // Micro spacing
  xs: BASE * 0.5,   // 4
  sm: BASE,         // 8
  md: BASE * 2,     // 16
  lg: BASE * 3,     // 24
  xl: BASE * 4,     // 32
  xxl: BASE * 6,    // 48
  xxxl: BASE * 8,   // 64
};

// Screen padding
export const screenPadding = {
  horizontal: spacing.md,  // 16
  vertical: spacing.md,    // 16
  top: spacing.lg,         // 24
  bottom: spacing.xl,      // 32
};

// Component spacing
export const componentSpacing = {
  // Stack spacing (vertical gaps between elements)
  stackXs: spacing.xs,     // 4
  stackSm: spacing.sm,     // 8
  stackMd: spacing.md,     // 16
  stackLg: spacing.lg,     // 24
  stackXl: spacing.xl,     // 32

  // Inline spacing (horizontal gaps)
  inlineXs: spacing.xs,    // 4
  inlineSm: spacing.sm,    // 8
  inlineMd: spacing.md,    // 16
  inlineLg: spacing.lg,    // 24
};

// Border radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

// Shadows (iOS-style)
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
  },
};

// Component sizes
export const sizes = {
  // Buttons
  buttonHeight: 50,
  buttonHeightSmall: 36,
  buttonHeightLarge: 56,

  // Avatars
  avatarXs: 24,
  avatarSm: 32,
  avatarMd: 48,
  avatarLg: 64,
  avatarXl: 96,
  avatarXxl: 128,

  // Icons
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconLg: 32,
  iconXl: 48,

  // Cards
  cardMinHeight: 80,
  playlistCardSize: 160,

  // Tab bar
  tabBarHeight: 80,

  // Now playing bar
  nowPlayingBarHeight: 64,

  // Hit slop for touch targets
  hitSlop: { top: 8, right: 8, bottom: 8, left: 8 },
};
