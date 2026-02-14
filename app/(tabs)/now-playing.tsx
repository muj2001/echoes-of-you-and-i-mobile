/**
 * Now Playing Screen
 * 
 * Shows current playback with sync controls
 * Beautiful album artwork display with partner status
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { Button, Avatar, StatusBadge } from '@/components/ui';
import {
  colors,
  gradients,
  getColors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '@/constants';

export default function NowPlayingScreen() {
  const { partnerId } = useAuth();
  const {
    isPartnerOnline,
    partnerStatus,
    joinPartnerSession,
    onSyncCommand,
    onSessionJoined,
  } = useSocket();
  const scheme = useColorScheme() ?? 'light';
  const themeColors = getColors(scheme);

  // Listen for sync commands
  useEffect(() => {
    const unsubscribeSync = onSyncCommand((command) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Synced!',
        `Now playing "${command.trackName}" by ${command.artistName}`,
        [{ text: 'OK' }]
      );
      // In a full implementation, this would trigger Spotify playback
    });

    const unsubscribeJoined = onSessionJoined((data) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Partner Joined!', data.message);
    });

    return () => {
      unsubscribeSync();
      unsubscribeJoined();
    };
  }, [onSyncCommand, onSessionJoined]);

  const handleJoinPartner = () => {
    if (!partnerStatus?.isListening) {
      Alert.alert(
        'Partner not listening',
        'Your partner is not currently listening to music.'
      );
      return;
    }
    joinPartnerSession();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Partner is listening - show their current track
  if (partnerStatus?.isListening) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.content}>
          {/* Partner Listening Card */}
          <View style={styles.partnerListeningBanner}>
            <Avatar name="Partner" size="sm" showStatus isOnline />
            <View style={styles.partnerListeningInfo}>
              <Text style={[styles.partnerListeningLabel, { color: themeColors.textSecondary }]}>
                Your partner is listening to
              </Text>
            </View>
          </View>

          {/* Album Artwork */}
          <View style={styles.artworkContainer}>
            <LinearGradient
              colors={[colors.primaryMuted, colors.accentLight]}
              style={styles.artworkGradient}
            >
              <View style={styles.artworkPlaceholder}>
                <Ionicons name="musical-note" size={80} color={colors.primary} />
              </View>
            </LinearGradient>
            
            {/* Sync indicator */}
            <View style={styles.syncBadge}>
              <Ionicons name="heart" size={16} color="#FFF" />
            </View>
          </View>

          {/* Track Info */}
          <View style={styles.trackInfo}>
            <Text style={[styles.trackName, { color: themeColors.text }]}>
              {partnerStatus.trackName || 'Unknown Track'}
            </Text>
            <Text style={[styles.artistName, { color: themeColors.textSecondary }]}>
              {partnerStatus.artistName || 'Unknown Artist'}
            </Text>
            {partnerStatus.playlistName && (
              <Text style={[styles.playlistName, { color: themeColors.textMuted }]}>
                from {partnerStatus.playlistName}
              </Text>
            )}
          </View>

          {/* Progress Placeholder */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressTrack, { backgroundColor: themeColors.border }]}>
              <View style={[styles.progressFill, { width: '45%' }]} />
            </View>
          </View>

          {/* Join Session Button */}
          <Button
            title="Listen Together"
            onPress={handleJoinPartner}
            variant="primary"
            size="large"
            icon={<Ionicons name="heart" size={20} color="#FFF" />}
            style={styles.joinButton}
          />

          <Text style={[styles.joinHint, { color: themeColors.textMuted }]}>
            Tap to sync your playback with your partner
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // No active playback
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.emptyState}>
        {/* Status Header */}
        {partnerId && (
          <View style={styles.partnerStatusCard}>
            <Avatar name="Partner" size="md" showStatus isOnline={isPartnerOnline} />
            <View style={styles.partnerStatusInfo}>
              <Text style={[styles.partnerStatusLabel, { color: themeColors.text }]}>
                Your Partner
              </Text>
              <StatusBadge status={isPartnerOnline ? 'online' : 'offline'} size="sm" />
            </View>
          </View>
        )}

        <View style={styles.emptyIconContainer}>
          <LinearGradient
            colors={[colors.primaryMuted, colors.accentLight]}
            style={styles.emptyIconGradient}
          >
            <Ionicons
              name="musical-notes-outline"
              size={64}
              color={colors.primary}
            />
          </LinearGradient>
        </View>
        
        <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
          Nothing playing
        </Text>
        <Text style={[styles.emptySubtitle, { color: themeColors.textSecondary }]}>
          {isPartnerOnline
            ? 'Start playing music in Spotify or wait for your partner to start listening'
            : 'Your partner is offline. Start playing music in Spotify to begin'
          }
        </Text>

        {/* Hearts decoration */}
        <View style={styles.heartsDecoration}>
          <Ionicons name="heart-outline" size={20} color={colors.primaryLight} />
          <Ionicons name="heart" size={28} color={colors.primaryLight} />
          <Ionicons name="heart-outline" size={20} color={colors.primaryLight} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    alignItems: 'center',
  },
  partnerListeningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primaryMuted,
    borderRadius: borderRadius.full,
  },
  partnerListeningInfo: {
    flex: 1,
  },
  partnerListeningLabel: {
    ...typography.subhead,
  },
  artworkContainer: {
    width: '85%',
    maxWidth: 320,
    aspectRatio: 1,
    marginBottom: spacing.xl,
    position: 'relative',
  },
  artworkGradient: {
    flex: 1,
    borderRadius: borderRadius.xxl,
    ...shadows.xl,
  },
  artworkPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artwork: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.xxl,
  },
  syncBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  trackName: {
    ...typography.title1,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  artistName: {
    ...typography.body,
    textAlign: 'center',
  },
  playlistName: {
    ...typography.footnote,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  progressContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  joinButton: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  joinHint: {
    ...typography.footnote,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  partnerStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xxl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  partnerStatusInfo: {
    gap: spacing.xs,
  },
  partnerStatusLabel: {
    ...typography.headline,
  },
  emptyIconContainer: {
    marginBottom: spacing.lg,
  },
  emptyIconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...typography.title2,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  heartsDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    opacity: 0.6,
  },
});
