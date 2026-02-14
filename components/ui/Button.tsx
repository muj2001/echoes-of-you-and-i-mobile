/**
 * Button - Primary UI component for actions
 * 
 * Variants:
 * - primary: Solid pink/gradient button
 * - secondary: Outlined button
 * - ghost: Text-only button
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, gradients, typography, spacing, borderRadius, sizes, shadows } from '@/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const buttonHeight = {
    small: sizes.buttonHeightSmall,
    medium: sizes.buttonHeight,
    large: sizes.buttonHeightLarge,
  }[size];

  const fontSize = {
    small: 14,
    medium: 17,
    large: 18,
  }[size];

  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[styles.buttonBase, { height: buttonHeight }, style]}
      >
        <LinearGradient
          colors={isDisabled ? ['#CCC', '#AAA'] : [...gradients.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, { height: buttonHeight }]}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              {icon}
              <Text style={[styles.primaryText, { fontSize }, textStyle]}>
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'secondary') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={isDisabled}
        activeOpacity={0.7}
        style={[
          styles.buttonBase,
          styles.secondaryButton,
          { height: buttonHeight },
          isDisabled && styles.disabledSecondary,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <>
            {icon}
            <Text
              style={[
                styles.secondaryText,
                { fontSize },
                isDisabled && styles.disabledText,
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  // Ghost variant
  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.6}
      style={[styles.ghostButton, { height: buttonHeight }, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.ghostText,
              { fontSize },
              isDisabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    ...shadows.none,
  },
  secondaryText: {
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  disabledSecondary: {
    borderColor: '#CCC',
  },
  ghostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  ghostText: {
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  disabledText: {
    color: '#999',
  },
});
