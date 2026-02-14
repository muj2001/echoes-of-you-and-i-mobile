/**
 * Invite Screen
 * 
 * Create and manage partnership invites
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/contexts/AuthContext';
import { api, Invite } from '@/lib/api';
import { Card, Button } from '@/components/ui';
import {
  colors,
  getColors,
  typography,
  spacing,
  borderRadius,
} from '@/constants';

export default function InviteScreen() {
  const { spotifyId, partnerId } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const themeColors = getColors(scheme);

  const [invite, setInvite] = useState<Invite | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check for existing invites on mount
  useEffect(() => {
    fetchExistingInvite();
  }, []);

  const fetchExistingInvite = async () => {
    if (!spotifyId) return;
    
    setIsLoading(true);
    try {
      const response = await api.getMyInvites(spotifyId);
      if (response.invites.length > 0) {
        setInvite(response.invites[0]);
      }
    } catch (error) {
      console.error('Error fetching invites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createInvite = async () => {
    if (!spotifyId) return;

    setIsCreating(true);
    try {
      const response = await api.createInvite(spotifyId);
      setInvite(response.invite);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create invite');
    } finally {
      setIsCreating(false);
    }
  };

  const copyLink = async () => {
    if (!invite) return;
    
    await Clipboard.setStringAsync(invite.url);
    setCopied(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (!invite) return;

    try {
      await Share.share({
        message: `Join me on Echoes of You & I! ${invite.url}`,
        url: invite.url,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getTimeRemaining = () => {
    if (!invite) return '';
    
    const expiresAt = new Date(invite.expiresAt);
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  // If user already has a partner
  if (partnerId) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>
            Invite Partner
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.hasPartnerState}>
            <Ionicons name="heart" size={64} color={colors.primary} />
            <Text style={[styles.hasPartnerTitle, { color: themeColors.text }]}>
              Already connected
            </Text>
            <Text style={[styles.hasPartnerSubtitle, { color: themeColors.textSecondary }]}>
              You already have a partner. To invite someone new, you&apos;ll need to disconnect first.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>
          Invite Partner
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {invite ? (
          // Show existing invite
          <View style={styles.inviteContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="heart" size={48} color={colors.primary} />
              <Ionicons
                name="link"
                size={24}
                color={colors.primary}
                style={styles.linkIcon}
              />
            </View>

            <Text style={[styles.title, { color: themeColors.text }]}>
              Your invite link
            </Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
              Share this link with your partner to connect
            </Text>

            <Card variant="outlined" padding="md" style={styles.linkCard}>
              <Text
                style={[styles.linkText, { color: themeColors.text }]}
                numberOfLines={1}
              >
                {invite.url}
              </Text>
            </Card>

            <Text style={[styles.expiry, { color: themeColors.textMuted }]}>
              {getTimeRemaining()}
            </Text>

            <View style={styles.actions}>
              <Button
                title={copied ? 'Copied!' : 'Copy Link'}
                onPress={copyLink}
                variant="secondary"
                icon={
                  <Ionicons
                    name={copied ? 'checkmark' : 'copy-outline'}
                    size={20}
                    color={colors.primary}
                  />
                }
                style={styles.actionButton}
              />
              <Button
                title="Share"
                onPress={shareLink}
                variant="primary"
                icon={<Ionicons name="share-outline" size={20} color="#FFF" />}
                style={styles.actionButton}
              />
            </View>
          </View>
        ) : (
          // Create new invite
          <View style={styles.createContent}>
            <View style={styles.iconContainer}>
              <Ionicons name="heart-outline" size={64} color={colors.primary} />
            </View>

            <Text style={[styles.title, { color: themeColors.text }]}>
              Invite your partner
            </Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
              Create an invite link to share with the one you love.
              The link expires in 24 hours.
            </Text>

            <Button
              title="Create Invite Link"
              onPress={createInvite}
              variant="primary"
              size="large"
              loading={isCreating}
              style={styles.createButton}
            />
          </View>
        )}
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
  createContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xxxl,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: spacing.xl,
  },
  linkIcon: {
    position: 'absolute',
    bottom: -8,
    right: -12,
  },
  title: {
    ...typography.title1,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  linkCard: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  linkText: {
    ...typography.callout,
    fontFamily: 'monospace',
  },
  expiry: {
    ...typography.footnote,
    marginBottom: spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  actionButton: {
    flex: 1,
  },
  createButton: {
    width: '100%',
  },
  hasPartnerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  hasPartnerTitle: {
    ...typography.title2,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  hasPartnerSubtitle: {
    ...typography.body,
    textAlign: 'center',
  },
});
