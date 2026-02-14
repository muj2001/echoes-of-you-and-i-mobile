/**
 * Auth Callback Screen
 * 
 * Handles the OAuth callback from Spotify
 * Extracts user info and redirects to home
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { GradientBackground, Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { setStoredSpotifyId, setStoredUser, StoredUser } from '@/lib/storage';
import { typography, spacing } from '@/constants';

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // The backend returns JSON with user info
      // We need to parse the spotifyId from the response
      const spotifyId = params.spotifyId as string;
      
      if (!spotifyId) {
        // If no spotifyId, try to get it from the URL hash or other params
        setError('Authentication failed. Please try again.');
        return;
      }

      // Fetch user profile from backend
      const response = await api.getMe(spotifyId);
      
      const user: StoredUser = {
        id: response.user.id,
        spotifyId: response.user.id,
        displayName: response.user.displayName,
        email: response.user.email,
        images: response.user.images,
        partnerId: response.partnerId,
      };

      // Store credentials
      await setStoredSpotifyId(spotifyId);
      await setStoredUser(user);

      // Refresh auth state
      await refreshUser();

      // Navigate to home
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Auth callback error:', err);
      setError(err.message || 'Authentication failed');
    }
  };

  if (error) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <Text style={styles.errorTitle}>Authentication Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Button
            title="Try Again"
            onPress={() => router.replace('/')}
            variant="secondary"
            style={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>Connecting to Spotify...</Text>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.body,
    color: '#FFF',
    marginTop: spacing.lg,
  },
  errorTitle: {
    ...typography.title2,
    color: '#FFF',
    marginBottom: spacing.sm,
  },
  errorMessage: {
    ...typography.body,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: '#FFF',
    borderColor: '#FFF',
  },
  buttonText: {
    color: '#1A1A1A',
  },
});
