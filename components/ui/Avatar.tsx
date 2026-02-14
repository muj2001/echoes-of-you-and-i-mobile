/**
 * Avatar - User profile image with status indicator
 */

import React from 'react';
import { View, Image, StyleSheet, Text, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, getColors, borderRadius, sizes } from '@/constants';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  showStatus?: boolean;
  isOnline?: boolean;
  showBorder?: boolean;
}

export function Avatar({
  uri,
  name,
  size = 'md',
  showStatus = false,
  isOnline = false,
  showBorder = false,
}: AvatarProps) {
  const scheme = useColorScheme() ?? 'light';
  const themeColors = getColors(scheme);
  
  const sizeValue = sizes[`avatar${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof sizes] as number;
  const statusSize = Math.max(sizeValue * 0.25, 8);
  const fontSize = sizeValue * 0.4;

  // Get initials from name
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const containerStyle = {
    width: sizeValue,
    height: sizeValue,
    borderRadius: sizeValue / 2,
  };

  const borderStyle = showBorder
    ? {
        borderWidth: 3,
        borderColor: colors.primary,
      }
    : {};

  return (
    <View style={[styles.container, containerStyle]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, containerStyle, borderStyle]}
        />
      ) : (
        <LinearGradient
          colors={[...gradients.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.placeholder, containerStyle, borderStyle]}
        >
          <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
        </LinearGradient>
      )}

      {showStatus && (
        <View
          style={[
            styles.statusBadge,
            {
              width: statusSize,
              height: statusSize,
              borderRadius: statusSize / 2,
              backgroundColor: isOnline ? colors.online : colors.offline,
              borderColor: themeColors.surface,
            },
          ]}
        />
      )}
    </View>
  );
}

// Double avatar for showing partnership
export function PartnerAvatars({
  user1Uri,
  user1Name,
  user2Uri,
  user2Name,
  size = 'lg',
}: {
  user1Uri?: string | null;
  user1Name?: string;
  user2Uri?: string | null;
  user2Name?: string;
  size?: 'md' | 'lg' | 'xl';
}) {
  const sizeValue = sizes[`avatar${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof sizes] as number;
  const overlap = sizeValue * 0.3;

  return (
    <View style={[styles.partnerContainer, { width: sizeValue * 2 - overlap }]}>
      <Avatar uri={user1Uri} name={user1Name} size={size} showBorder />
      <View style={{ marginLeft: -overlap }}>
        <Avatar uri={user2Uri} name={user2Name} size={size} showBorder />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
  partnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
