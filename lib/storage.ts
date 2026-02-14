/**
 * Storage utilities using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  SPOTIFY_ID: '@echoes:spotifyId',
  USER_DATA: '@echoes:userData',
};

export interface StoredUser {
  id: string;
  spotifyId: string;
  displayName: string;
  email?: string;
  images?: { url: string }[];
  partnerId?: string | null;
}

// Spotify ID
export async function getStoredSpotifyId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(KEYS.SPOTIFY_ID);
  } catch {
    return null;
  }
}

export async function setStoredSpotifyId(spotifyId: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.SPOTIFY_ID, spotifyId);
}

export async function removeStoredSpotifyId(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.SPOTIFY_ID);
}

// User data
export async function getStoredUser(): Promise<StoredUser | null> {
  try {
    const json = await AsyncStorage.getItem(KEYS.USER_DATA);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export async function setStoredUser(user: StoredUser): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
}

export async function removeStoredUser(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.USER_DATA);
}

// Clear all auth data
export async function clearAuthData(): Promise<void> {
  await Promise.all([
    removeStoredSpotifyId(),
    removeStoredUser(),
  ]);
}
