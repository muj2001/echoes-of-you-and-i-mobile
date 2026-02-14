/**
 * Card - Elevated surface container
 * 
 * Apple-style card with subtle shadow and rounded corners
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { colors, getColors, spacing, borderRadius, shadows } from '@/constants';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export function Card({
  children,
  onPress,
  variant = 'default',
  padding = 'md',
  style,
}: CardProps) {
  const scheme = useColorScheme() ?? 'light';
  const themeColors = getColors(scheme);

  const paddingValue = {
    none: 0,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
  }[padding];

  const cardStyle: ViewStyle = {
    backgroundColor: variant === 'elevated' 
      ? themeColors.surfaceElevated 
      : themeColors.surface,
    padding: paddingValue,
    borderRadius: borderRadius.xl,
    ...(variant === 'outlined' 
      ? { borderWidth: 1, borderColor: themeColors.border }
      : variant === 'elevated' 
        ? shadows.lg 
        : shadows.md
    ),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}

// Specialized card variants
export function PartnerCard({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  return (
    <Card
      variant="elevated"
      padding="lg"
      onPress={onPress}
      style={StyleSheet.flatten([styles.partnerCard, style])}
    >
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  partnerCard: {
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
});
