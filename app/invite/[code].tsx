/**
 * Accept Invite Screen
 * 
 * Modal screen for viewing and accepting/declining partnership invites
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/contexts/AuthContext';
import { api, Invite } from '@/lib/api';
import { Avatar, Button, GradientBackground } from '@/components/ui';
import {
  colors,
  getColors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '@/constants';

type InviteStatus = 'loading' | 'valid' | 'expired' | 'not_found' | 'error';

export default function AcceptInviteScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { isAuthenticated, spotifyId, partnerId, login, refreshUser } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const themeColors = getColors(scheme);

  const [status, setStatus] = useState<InviteStatus>('loading');
  const [invite, setInvite] = useState<Invite | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  useEffect(() => {
    if (code) {
      fetchInvite();
    }
  }, [code]);

  const fetchInvite = async () => {
    try {
      const response = await api.getInvite(code!);
      setInvite(response.invite);
      setStatus('valid');
    } catch (error: any) {
      if (error.message.includes('404') || error.message.includes('not found')) {
        setStatus('not_found');
      } else if (error.message.includes('expired') || error.message.includes('410')) {
        setStatus('expired');
      } else {
        setStatus('error');
      }
    }
  };

  const handleAccept = async () => {
    if (!spotifyId || !code) return;

    setIsAccepting(true);
    try {
      await api.acceptInvite(code, spotifyId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await refreshUser();
      
      Alert.alert(
        'Connected!',
        `You and ${invite?.inviter?.displayName || 'your partner'} are now connected.`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to accept invite');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDecline = async () => {
    if (!spotifyId || !code) return;

    Alert.alert(
      'Decline Invite',
      'Are you sure you want to decline this invite?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            setIsDeclining(true);
            try {
              await api.declineInvite(code, spotifyId);
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to decline invite');
            } finally {
              setIsDeclining(false);
            }
          },
        },
      ]
    );
  };

  // Loading state
  if (status === 'loading') {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  // Error states
  if (status === 'not_found' || status === 'error') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={themeColors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={[styles.errorTitle, { color: themeColors.text }]}>
            Invite not found
          </Text>
          <Text style={[styles.errorSubtitle, { color: themeColors.textSecondary }]}>
            This invite link is invalid or has already been used.
          </Text>
          <Button
            title="Go Home"
            onPress={() => router.replace('/')}
            variant="primary"
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (status === 'expired') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={themeColors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContent}>
          <Ionicons name="time-outline" size={64} color={themeColors.textMuted} />
          <Text style={[styles.errorTitle, { color: themeColors.text }]}>
            Invite expired
          </Text>
          <Text style={[styles.errorSubtitle, { color: themeColors.textSecondary }]}>
            This invite link has expired. Ask your partner to send a new one.
          </Text>
          <Button
            title="Go Home"
            onPress={() => router.replace('/')}
            variant="primary"
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // User already has a partner
  if (isAuthenticated && partnerId) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={themeColors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContent}>
          <Ionicons name="heart" size={64} color={colors.primary} />
          <Text style={[styles.errorTitle, { color: themeColors.text }]}>
            Already connected
          </Text>
          <Text style={[styles.errorSubtitle, { color: themeColors.textSecondary }]}>
            You already have a partner. To accept this invite, you would need to disconnect first.
          </Text>
          <Button
            title="Go Home"
            onPress={() => router.replace('/(tabs)')}
            variant="primary"
            style={styles.errorButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Need to login first
  if (!isAuthenticated) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.centerContent}>
            <Avatar name={invite?.inviter?.displayName} size="xxl" />
            <Text style={styles.inviterName}>
              {invite?.inviter?.displayName || 'Someone special'}
            </Text>
            <Text style={styles.inviteMessage}>
              wants to be your partner
            </Text>
            <Text style={styles.loginPrompt}>
              Connect with Spotify to accept this invite
            </Text>
            <Button
              title="Connect with Spotify"
              onPress={login}
              variant="secondary"
              size="large"
              icon={<Ionicons name="musical-note" size={24} color="#1DB954" />}
              style={styles.spotifyButton}
              textStyle={styles.spotifyButtonText}
            />
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  // Valid invite, user is authenticated
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.inviteCard}>
          <Avatar name={invite?.inviter?.displayName} size="xxl" showBorder />
          
          <Text style={[styles.inviterNameDark, { color: themeColors.text }]}>
            {invite?.inviter?.displayName || 'Someone'}
          </Text>
          
          <Text style={[styles.inviteMessageDark, { color: themeColors.textSecondary }]}>
            wants to share their music journey with you
          </Text>

          <View style={styles.hearts}>
            <Ionicons name="heart" size={24} color={colors.primaryLight} />
            <Ionicons name="heart" size={32} color={colors.primary} />
            <Ionicons name="heart" size={24} color={colors.primaryLight} />
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Accept"
            onPress={handleAccept}
            variant="primary"
            size="large"
            loading={isAccepting}
            icon={<Ionicons name="heart" size={20} color="#FFF" />}
            style={styles.acceptButton}
          />
          <Button
            title="Decline"
            onPress={handleDecline}
            variant="ghost"
            loading={isDeclining}
            textStyle={{ color: themeColors.textMuted }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  inviteCard: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
  },
  inviterName: {
    ...typography.title1,
    color: '#FFF',
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  inviterNameDark: {
    ...typography.title1,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  inviteMessage: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  inviteMessageDark: {
    ...typography.body,
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  hearts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  loginPrompt: {
    ...typography.subhead,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  spotifyButton: {
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    width: '100%',
  },
  spotifyButtonText: {
    color: '#1A1A1A',
  },
  actions: {
    gap: spacing.md,
  },
  acceptButton: {
    width: '100%',
  },
  errorTitle: {
    ...typography.title2,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorSubtitle: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  errorButton: {
    minWidth: 160,
  },
});
