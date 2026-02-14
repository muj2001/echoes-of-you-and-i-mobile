/**
 * Playlists Screen
 * 
 * Shows all shared playlists with ability to create new ones
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { api, Playlist } from '@/lib/api';
import { Card, Button } from '@/components/ui';
import {
  colors,
  getColors,
  typography,
  spacing,
  borderRadius,
  sizes,
  shadows,
} from '@/constants';

export default function PlaylistsScreen() {
  const { spotifyId } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const themeColors = getColors(scheme);

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchPlaylists = useCallback(async () => {
    if (!spotifyId) return;
    
    try {
      const response = await api.getPlaylists(spotifyId);
      setPlaylists(response.playlists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [spotifyId]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPlaylists();
  };

  const handleCreatePlaylist = async () => {
    if (!spotifyId || !newPlaylistName.trim()) return;

    setIsCreating(true);
    try {
      await api.createPlaylist(spotifyId, newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreateModal(false);
      fetchPlaylists();
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const renderPlaylist = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      style={[styles.playlistCard, { backgroundColor: themeColors.surface }]}
      onPress={() => router.push(`/playlist/${item.id}`)}
      activeOpacity={0.7}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.playlistImage} />
      ) : (
        <View style={[styles.playlistImagePlaceholder]}>
          <Ionicons name="musical-notes" size={32} color={colors.primary} />
        </View>
      )}
      <Text
        style={[styles.playlistName, { color: themeColors.text }]}
        numberOfLines={2}
      >
        {item.name}
      </Text>
      <Text style={[styles.playlistTracks, { color: themeColors.textSecondary }]}>
        {item.trackCount} tracks
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          Our Playlists
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Playlists Grid */}
      <FlatList
        data={playlists}
        renderItem={renderPlaylist}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
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
            <Ionicons
              name="musical-notes-outline"
              size={64}
              color={colors.primaryLight}
            />
            <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
              No playlists yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: themeColors.textSecondary }]}>
              Create your first shared playlist together
            </Text>
            <Button
              title="Create Playlist"
              onPress={() => setShowCreateModal(true)}
              variant="primary"
              style={styles.emptyButton}
            />
          </View>
        }
      />

      {/* Create Playlist Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.modalCancel, { color: themeColors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
              New Playlist
            </Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: themeColors.surface,
                    color: themeColors.text,
                    borderColor: themeColors.border,
                  },
                ]}
                placeholder="Playlist name"
                placeholderTextColor={themeColors.textMuted}
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
                autoFocus
              />
            </View>

            <Text style={[styles.hint, { color: themeColors.textSecondary }]}>
              This playlist will be collaborative - both you and your partner can add songs
            </Text>

            <Button
              title="Create"
              onPress={handleCreatePlaylist}
              variant="primary"
              size="large"
              disabled={!newPlaylistName.trim()}
              loading={isCreating}
              style={styles.createButton}
            />
          </View>
        </View>
      </Modal>
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
  title: {
    ...typography.largeTitle,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: spacing.md,
    paddingTop: 0,
  },
  row: {
    gap: spacing.md,
  },
  playlistCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  playlistImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  playlistImagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  playlistName: {
    ...typography.headline,
    marginBottom: spacing.xs,
  },
  playlistTracks: {
    ...typography.caption1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...typography.title2,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyButton: {
    minWidth: 180,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.light.border,
  },
  modalCancel: {
    ...typography.body,
  },
  modalTitle: {
    ...typography.headline,
  },
  modalContent: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  hint: {
    ...typography.footnote,
    textAlign: 'center',
  },
  createButton: {
    marginTop: spacing.lg,
  },
});
