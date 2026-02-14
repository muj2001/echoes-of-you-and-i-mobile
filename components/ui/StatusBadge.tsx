/**
 * StatusBadge - Online/offline indicator with label
 */

import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { colors, getColors, typography, spacing, borderRadius } from '@/constants';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'synced' | 'listening';
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const statusConfig = {
  online: {
    color: colors.online,
    label: 'Online',
  },
  offline: {
    color: colors.offline,
    label: 'Offline',
  },
  synced: {
    color: colors.synced,
    label: 'Synced',
  },
  listening: {
    color: colors.primary,
    label: 'Listening',
  },
};

export function StatusBadge({
  status,
  showLabel = true,
  size = 'md',
}: StatusBadgeProps) {
  const scheme = useColorScheme() ?? 'light';
  const themeColors = getColors(scheme);
  const config = statusConfig[status];

  const dotSize = size === 'sm' ? 6 : 8;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: config.color,
          },
        ]}
      />
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              color: themeColors.textSecondary,
              fontSize: size === 'sm' ? 11 : 12,
            },
          ]}
        >
          {config.label}
        </Text>
      )}
    </View>
  );
}

// Animated listening indicator
export function ListeningIndicator() {
  return (
    <View style={styles.listeningContainer}>
      <View style={[styles.bar, styles.bar1]} />
      <View style={[styles.bar, styles.bar2]} />
      <View style={[styles.bar, styles.bar3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    // Animated pulse would go here
  },
  label: {
    ...typography.caption1,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listeningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 16,
  },
  bar: {
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
  },
  bar1: {
    height: 8,
  },
  bar2: {
    height: 14,
  },
  bar3: {
    height: 10,
  },
});
