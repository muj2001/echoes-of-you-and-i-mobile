/**
 * Playlist Detail Screen
 * 
 * Shows playlist info and track list
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { api, Playlist, Track } from '@/lib/api';
import { Button } from '@/components/ui';
import {
  colors,
  gradients,
  getColors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '@/constants';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { spotifyId } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const themeColors = getColors(scheme);

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPlaylistData = useCallback(async () => {
    if (!spotifyId || !id) return;

    try {
      const [playlistResponse, tracksResponse] = await Promise.all([
        api.getPlaylist(id, spotifyId),
        api.getPlaylistTracks(id, spotifyId),
      ]);
      
      setPlaylist(playlistResponse.playlist);
      setTracks(tracksResponse.tracks);
    } catch (error) {
      console.error('Error fetching playlist:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [id, spotifyId]);

  useEffect(() => {
    fetchPlaylistData();
  }, [fetchPlaylistData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPlaylistData();
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Playlist Cover */}
      <View style={styles.coverContainer}>
        {playlist?.image ? (
          <Image source={{ uri: playlist.image }} style={styles.cover} />
        ) : (
          <LinearGradient
            colors={[...gradients.primary]}
            style={styles.coverPlaceholder}
          >
            <Ionicons name="musical-notes" size={64} color="#FFF" />
          </LinearGradient>
        )}
      </View>

      {/* Playlist Info */}
      <Text style={[styles.playlistName, { color: themeColors.text }]}>
        {playlist?.name || 'Loading...'}
      </Text>
      
      <View style={styles.metaRow}>
        <Text style={[styles.metaText, { color: themeColors.textSecondary }]}>
          {playlist?.trackCount || 0} tracks
        </Text>
        {playlist?.collaborative && (
          <>
            <Text style={[styles.metaDot, { color: themeColors.textMuted }]}>•</Text>
            <View style={styles.collaborativeBadge}>
              <Ionicons name="people" size={14} color={colors.primary} />
              <Text style={styles.collaborativeText}>Collaborative</Text>
            </View>
          </>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title="Listen Together"
          onPress={() => {}}
          variant="primary"
          icon={<Ionicons name="heart" size={18} color="#FFF" />}
          style={styles.playButton}
        />
      </View>

      {/* Track List Header */}
      <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
        Tracks
      </Text>
    </View>
  );

  const renderTrack = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={[styles.trackRow, { borderBottomColor: themeColors.divider }]}
      activeOpacity={0.7}
    >
      <Text style={[styles.trackNumber, { color: themeColors.textMuted }]}>
        {index + 1}
      </Text>
      
      {item.albumImage ? (
        <Image source={{ uri: item.albumImage }} style={styles.trackImage} />
      ) : (
        <View style={[styles.trackImagePlaceholder, { backgroundColor: themeColors.border }]}>
          <Ionicons name="musical-note" size={16} color={themeColors.textMuted} />
        </View>
      )}
      
      <View style={styles.trackInfo}>
        <Text
          style={[styles.trackName, { color: themeColors.text }]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text
          style={[styles.trackArtist, { color: themeColors.textSecondary }]}
          numberOfLines={1}
        >
          {item.artists}
        </Text>
      </View>
      
      <Text style={[styles.trackDuration, { color: themeColors.textMuted }]}>
        {formatDuration(item.durationMs)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={themeColors.text} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color={themeColors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tracks}
        renderItem={renderTrack}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
              {isLoading ? 'Loading tracks...' : 'No tracks yet'}
            </Text>
            {!isLoading && (
              <Text style={[styles.emptyHint, { color: themeColors.textMuted }]}>
                Add songs in Spotify to see them here
              </Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  listContent: {
    paddingBottom: spacing.xxxl,
  },
  headerContent: {
    padding: spacing.md,
    alignItems: 'center',
  },
  coverContainer: {
    width: 200,
    height: 200,
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  cover: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.lg,
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistName: {
    ...typography.title1,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metaText: {
    ...typography.subhead,
  },
  metaDot: {
    ...typography.subhead,
  },
  collaborativeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  collaborativeText: {
    ...typography.subhead,
    color: colors.primary,
  },
  actions: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  playButton: {
    width: '100%',
  },
  sectionTitle: {
    ...typography.title3,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
  },
  trackNumber: {
    ...typography.subhead,
    width: 24,
    textAlign: 'center',
  },
  trackImage: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
  },
  trackImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackInfo: {
    flex: 1,
    gap: 2,
  },
  trackName: {
    ...typography.headline,
  },
  trackArtist: {
    ...typography.subhead,
  },
  trackDuration: {
    ...typography.subhead,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
  },
  emptyHint: {
    ...typography.footnote,
    marginTop: spacing.sm,
  },
});
