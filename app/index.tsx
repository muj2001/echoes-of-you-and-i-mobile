/**
 * Auth Screen - Landing page for unauthenticated users
 * 
 * Features:
 * - Gradient background
 * - App branding with heart motif
 * - "Connect with Spotify" button
 * - Romantic tagline
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground, Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { typography, spacing, sizes } from '@/constants';

export default function AuthScreen() {
  const { isLoading, isAuthenticated, login } = useAuth();

  // Redirect to home if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Logo and branding */}
        <View style={styles.brandingContainer}>
          <View style={styles.logoContainer}>
            <Ionicons name="heart" size={64} color="#FFF" />
            <Ionicons
              name="musical-notes"
              size={32}
              color="#FFF"
              style={styles.musicIcon}
            />
          </View>
          
          <Text style={styles.title}>Echoes of</Text>
          <Text style={styles.titleAccent}>You & I</Text>
          
          <Text style={styles.tagline}>
            Listen together, no matter the distance
          </Text>
        </View>

        {/* Login button */}
        <View style={styles.actionContainer}>
          <Button
            title="Connect with Spotify"
            onPress={login}
            variant="secondary"
            size="large"
            icon={<Ionicons name="musical-note" size={24} color="#1DB954" />}
            style={styles.spotifyButton}
            textStyle={styles.spotifyButtonText}
          />
          
          <Text style={styles.disclaimer}>
            Share your music moments with the one you love
          </Text>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl * 2,
    paddingBottom: spacing.xxxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingContainer: {
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: spacing.xl,
  },
  musicIcon: {
    position: 'absolute',
    bottom: -8,
    right: -16,
    opacity: 0.9,
  },
  title: {
    ...typography.largeTitle,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  titleAccent: {
    ...typography.largeTitle,
    fontSize: 42,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    marginTop: -4,
  },
  tagline: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  actionContainer: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  spotifyButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
    width: '100%',
  },
  spotifyButtonText: {
    color: '#1A1A1A',
  },
  disclaimer: {
    ...typography.footnote,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});
