/**
 * Home Screen
 * 
 * Main dashboard showing:
 * - User greeting
 * - Partner status card
 * - Quick actions
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { Card, Avatar, Button, StatusBadge } from '@/components/ui';
import {
  colors,
  getColors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '@/constants';

export default function HomeScreen() {
  const { user, partnerId, logout } = useAuth();
  const { isPartnerOnline, partnerStatus } = useSocket();
  const scheme = useColorScheme() ?? 'light';
  const themeColors = getColors(scheme);

  const firstName = user?.displayName?.split(' ')[0] || 'there';
  const userImage = user?.images?.[0]?.url;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: themeColors.textSecondary }]}>
              Welcome back,
            </Text>
            <Text style={[styles.name, { color: themeColors.text }]}>
              {firstName}
            </Text>
          </View>
          <TouchableOpacity onPress={logout}>
            <Avatar uri={userImage} name={user?.displayName} size="md" />
          </TouchableOpacity>
        </View>

        {/* Partner Card */}
        <Card
          variant="elevated"
          padding="lg"
          onPress={() => router.push('/partner')}
          style={styles.partnerCard}
        >
          {partnerId ? (
            <PartnerConnected
              isOnline={isPartnerOnline}
              partnerStatus={partnerStatus}
            />
          ) : (
            <NoPartner />
          )}
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <QuickActionCard
              icon="add-circle"
              title="Create Playlist"
              subtitle="Start a new shared playlist"
              onPress={() => router.push('/playlists')}
              themeColors={themeColors}
            />
            <QuickActionCard
              icon="people"
              title="Invite Partner"
              subtitle="Send an invite link"
              onPress={() => router.push('/invite')}
              themeColors={themeColors}
            />
          </View>
        </View>

        {/* Recent Activity placeholder */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Your Connection
          </Text>
          <Card variant="outlined" padding="lg">
            <View style={styles.emptyState}>
              <Ionicons
                name="heart-half"
                size={48}
                color={colors.primaryLight}
              />
              <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
                Share the moment
              </Text>
              <Text style={[styles.emptySubtitle, { color: themeColors.textSecondary }]}>
                When you and your partner listen together, your shared moments will appear here
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PartnerConnected({
  isOnline,
  partnerStatus,
}: {
  isOnline: boolean;
  partnerStatus: ReturnType<typeof useSocket>['partnerStatus'];
}) {
  const scheme = useColorScheme() ?? 'light';
  const themeColors = getColors(scheme);
  
  return (
    <View style={styles.partnerContent}>
      <View style={styles.partnerHeader}>
        <Avatar name="Partner" size="lg" showStatus isOnline={isOnline} />
        <View style={styles.partnerInfo}>
          <Text style={[styles.partnerLabel, { color: themeColors.textSecondary }]}>
            Your Partner
          </Text>
          {partnerStatus?.isListening ? (
            <>
              <Text
                style={[styles.partnerTrack, { color: themeColors.text }]}
                numberOfLines={1}
              >
                {partnerStatus.trackName || 'Listening...'}
              </Text>
              <Text
                style={[styles.partnerArtist, { color: themeColors.textSecondary }]}
                numberOfLines={1}
              >
                {partnerStatus.artistName}
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.partnerName, { color: themeColors.text }]}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
              <StatusBadge status={isOnline ? 'online' : 'offline'} size="sm" />
            </>
          )}
        </View>
      </View>
      <View style={styles.partnerAction}>
        <Button
          title={partnerStatus?.isListening ? 'Listen Together' : 'Sync Together'}
          onPress={() => router.push('/partner')}
          variant="primary"
          size="medium"
          disabled={!partnerStatus?.isListening}
          icon={<Ionicons name={partnerStatus?.isListening ? 'heart' : 'sync'} size={18} color="#FFF" />}
        />
      </View>
    </View>
  );
}

function NoPartner() {
  const scheme = useColorScheme() ?? 'light';
  const themeColors = getColors(scheme);

  return (
    <View style={styles.noPartnerContent}>
      <View style={styles.noPartnerIcon}>
        <Ionicons name="heart-outline" size={40} color={colors.primary} />
        <Ionicons
          name="add"
          size={20}
          color={colors.primary}
          style={styles.addIcon}
        />
      </View>
      <Text style={[styles.noPartnerTitle, { color: themeColors.text }]}>
        Find your partner
      </Text>
      <Text style={[styles.noPartnerSubtitle, { color: themeColors.textSecondary }]}>
        Invite someone special to share your music journey
      </Text>
      <Button
        title="Send Invite"
        onPress={() => router.push('/invite')}
        variant="primary"
        size="medium"
        style={styles.inviteButton}
      />
    </View>
  );
}

function QuickActionCard({
  icon,
  title,
  subtitle,
  onPress,
  themeColors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  themeColors: ReturnType<typeof getColors>;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionCard, { backgroundColor: themeColors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.actionIconContainer}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <Text style={[styles.actionTitle, { color: themeColors.text }]}>
        {title}
      </Text>
      <Text style={[styles.actionSubtitle, { color: themeColors.textSecondary }]}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.subhead,
  },
  name: {
    ...typography.title1,
  },
  partnerCard: {
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  partnerContent: {
    gap: spacing.lg,
  },
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  partnerInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  partnerLabel: {
    ...typography.caption1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  partnerName: {
    ...typography.title3,
  },
  partnerTrack: {
    ...typography.headline,
  },
  partnerArtist: {
    ...typography.subhead,
  },
  partnerAction: {
    alignItems: 'flex-start',
  },
  noPartnerContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  noPartnerIcon: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  addIcon: {
    position: 'absolute',
    bottom: -4,
    right: -8,
    backgroundColor: colors.primaryMuted,
    borderRadius: 10,
    padding: 2,
  },
  noPartnerTitle: {
    ...typography.title3,
    marginBottom: spacing.xs,
  },
  noPartnerSubtitle: {
    ...typography.subhead,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  inviteButton: {
    minWidth: 140,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.title3,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionTitle: {
    ...typography.headline,
    marginBottom: spacing.xs,
  },
  actionSubtitle: {
    ...typography.caption1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyTitle: {
    ...typography.headline,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.subhead,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
