/**
 * Partner Screen
 * 
 * Shows partner details and current listening status
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { Avatar, Card, Button, StatusBadge } from '@/components/ui';
import {
  colors,
  getColors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '@/constants';

export default function PartnerScreen() {
  const { partnerId } = useAuth();
  const { isPartnerOnline, partnerStatus, joinPartnerSession } = useSocket();
  const scheme = useColorScheme() ?? 'light';
  const themeColors = getColors(scheme);

  // No partner connected
  if (!partnerId) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>
            Your Partner
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.emptyContent}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="heart-outline" size={64} color={colors.primaryLight} />
          </View>
          <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
            No partner yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: themeColors.textSecondary }]}>
            Invite someone special to share your music journey
          </Text>
          <Button
            title="Send Invite"
            onPress={() => router.push('/invite')}
            variant="primary"
            style={styles.inviteButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleSyncWithPartner = () => {
    if (!partnerStatus?.isListening) {
      Alert.alert(
        'Partner not listening',
        'Your partner is not currently listening to music. Try again when they start playing!'
      );
      return;
    }
    joinPartnerSession();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>
          Your Partner
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {/* Partner Profile */}
        <View style={styles.profileSection}>
          <Avatar
            name="Partner"
            size="xxl"
            showStatus
            isOnline={isPartnerOnline}
            showBorder
          />
          <Text style={[styles.partnerName, { color: themeColors.text }]}>
            Your Partner
          </Text>
          <StatusBadge
            status={isPartnerOnline ? 'online' : 'offline'}
            size="md"
          />
        </View>

        {/* Current Listening */}
        {partnerStatus?.isListening && (
          <Card variant="elevated" padding="lg" style={styles.listeningCard}>
            <View style={styles.listeningHeader}>
              <Ionicons name="musical-notes" size={20} color={colors.primary} />
              <Text style={[styles.listeningLabel, { color: themeColors.textSecondary }]}>
                Currently listening
              </Text>
            </View>
            <Text
              style={[styles.trackName, { color: themeColors.text }]}
              numberOfLines={1}
            >
              {partnerStatus.trackName || 'Unknown track'}
            </Text>
            <Text
              style={[styles.artistName, { color: themeColors.textSecondary }]}
              numberOfLines={1}
            >
              {partnerStatus.artistName || 'Unknown artist'}
            </Text>
            {partnerStatus.playlistName && (
              <Text
                style={[styles.playlistName, { color: themeColors.textMuted }]}
                numberOfLines={1}
              >
                from {partnerStatus.playlistName}
              </Text>
            )}
          </Card>
        )}

        {/* Sync Button */}
        <View style={styles.syncSection}>
          <Button
            title={partnerStatus?.isListening ? 'Listen Together' : 'Sync with Partner'}
            onPress={handleSyncWithPartner}
            variant="primary"
            size="large"
            disabled={!isPartnerOnline || !partnerStatus?.isListening}
            icon={<Ionicons name="sync" size={20} color="#FFF" />}
            style={styles.syncButton}
          />
          {!isPartnerOnline && (
            <Text style={[styles.syncHint, { color: themeColors.textMuted }]}>
              Your partner is offline
            </Text>
          )}
          {isPartnerOnline && !partnerStatus?.isListening && (
            <Text style={[styles.syncHint, { color: themeColors.textMuted }]}>
              Waiting for your partner to start playing...
            </Text>
          )}
        </View>

        {/* Connection Info */}
        <Card variant="outlined" padding="md" style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="heart" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: themeColors.textSecondary }]}>
              Connected as partners
            </Text>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.headline,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  partnerName: {
    ...typography.title1,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  listeningCard: {
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  listeningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  listeningLabel: {
    ...typography.caption1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trackName: {
    ...typography.headline,
  },
  artistName: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  playlistName: {
    ...typography.footnote,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  syncSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  syncButton: {
    width: '100%',
  },
  syncHint: {
    ...typography.footnote,
    marginTop: spacing.sm,
  },
  infoCard: {
    marginTop: 'auto',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    ...typography.subhead,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.title2,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  inviteButton: {
    minWidth: 160,
  },
});
