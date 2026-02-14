/**
 * GradientBackground - Full screen gradient backdrop
 * 
 * Used for auth screens and special views
 */

import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '@/constants';

interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'subtle' | 'dark';
  style?: ViewStyle;
}

export function GradientBackground({
  children,
  variant = 'primary',
  style,
}: GradientBackgroundProps) {
  const colors = gradients[variant];
  
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
