/**
 * Typography system for Echoes of You and I
 * 
 * Design: Clean, elegant hierarchy inspired by Apple's SF Pro
 * Uses system fonts for optimal rendering
 */

import { Platform, TextStyle } from 'react-native';

// System font family
const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

// Font weights (using numeric values for cross-platform consistency)
export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
};

// Type scale following Apple's guidelines
export const typography = {
  // Large titles - for main headers
  largeTitle: {
    fontFamily,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.37,
  } as TextStyle,

  // Title 1 - for section headers
  title1: {
    fontFamily,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.36,
  } as TextStyle,

  // Title 2 - for subsection headers
  title2: {
    fontFamily,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.35,
  } as TextStyle,

  // Title 3 - for card titles
  title3: {
    fontFamily,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.38,
  } as TextStyle,

  // Headline - for emphasized body text
  headline: {
    fontFamily,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.41,
  } as TextStyle,

  // Body - for main content
  body: {
    fontFamily,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.41,
  } as TextStyle,

  // Callout - for secondary content
  callout: {
    fontFamily,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.32,
  } as TextStyle,

  // Subhead - for labels
  subhead: {
    fontFamily,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.24,
  } as TextStyle,

  // Footnote - for captions
  footnote: {
    fontFamily,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.08,
  } as TextStyle,

  // Caption 1 - for small labels
  caption1: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
  } as TextStyle,

  // Caption 2 - for tiny labels
  caption2: {
    fontFamily,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.07,
  } as TextStyle,
};

// Semantic text styles
export const textStyles = {
  // Screen titles
  screenTitle: typography.largeTitle,
  
  // Section headers
  sectionHeader: typography.title2,
  
  // Card titles
  cardTitle: typography.title3,
  
  // Button text
  button: {
    ...typography.headline,
    textAlign: 'center' as const,
  },
  
  // Small button text
  buttonSmall: {
    ...typography.subhead,
    fontWeight: fontWeights.semibold,
    textAlign: 'center' as const,
  },
  
  // Input labels
  label: {
    ...typography.subhead,
    fontWeight: fontWeights.medium,
  },
  
  // Input placeholder
  placeholder: typography.body,
  
  // Status text (online, offline)
  status: {
    ...typography.caption1,
    fontWeight: fontWeights.medium,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
};
