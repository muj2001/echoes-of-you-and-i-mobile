/**
 * AuthContext - Manages authentication state
 * 
 * Handles:
 * - Spotify OAuth flow via web browser
 * - Storing/retrieving user session
 * - Fetching user profile and partner info
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { api, AuthMeResponse, User } from '@/lib/api';
import {
  getStoredSpotifyId,
  setStoredSpotifyId,
  getStoredUser,
  setStoredUser,
  clearAuthData,
  StoredUser,
} from '@/lib/storage';

// Ensure web browser auth sessions complete properly
WebBrowser.maybeCompleteAuthSession();

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: StoredUser | null;
  spotifyId: string | null;
  partnerId: string | null;
}

interface AuthContextValue extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    spotifyId: null,
    partnerId: null,
  });

  // Initialize auth state from storage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const spotifyId = await getStoredSpotifyId();
      const storedUser = await getStoredUser();

      if (spotifyId && storedUser) {
        // Verify the session is still valid
        try {
          const response = await api.getMe(spotifyId);
          const user: StoredUser = {
            id: response.user.id,
            spotifyId: response.user.id,
            displayName: response.user.displayName,
            email: response.user.email,
            images: response.user.images,
            partnerId: response.partnerId,
          };
          
          await setStoredUser(user);
          
          setState({
            isLoading: false,
            isAuthenticated: true,
            user,
            spotifyId,
            partnerId: response.partnerId,
          });
        } catch {
          // Session invalid, clear storage
          await clearAuthData();
          setState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            spotifyId: null,
            partnerId: null,
          });
        }
      } else {
        setState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          spotifyId: null,
          partnerId: null,
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        spotifyId: null,
        partnerId: null,
      });
    }
  };

  const login = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Open Spotify login in browser
      const loginUrl = api.getLoginUrl();
      const result = await WebBrowser.openAuthSessionAsync(
        loginUrl,
        Linking.createURL('/auth/callback')
      );

      if (result.type === 'success' && result.url) {
        // Parse the callback URL to get user info
        // The backend redirects with user info in the response
        // For now, we'll need to parse the spotifyId from the URL or handle differently
        
        // Since the backend returns JSON, we need to handle this differently
        // The backend callback returns JSON, not a redirect
        // We'll need to use a different approach - perhaps a custom scheme
        
        // For now, let's extract any potential spotifyId from the URL
        const url = new URL(result.url);
        const spotifyId = url.searchParams.get('spotifyId');
        
        if (spotifyId) {
          await handleAuthSuccess(spotifyId);
        } else {
          // If no spotifyId in URL, the auth may have succeeded
          // but we need to handle this case differently
          console.log('Auth result URL:', result.url);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const handleAuthSuccess = async (spotifyId: string) => {
    try {
      // Fetch user profile
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

      setState({
        isLoading: false,
        isAuthenticated: true,
        user,
        spotifyId,
        partnerId: response.partnerId,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      if (state.spotifyId) {
        await api.logout(state.spotifyId);
      }

      await clearAuthData();

      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        spotifyId: null,
        partnerId: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      await clearAuthData();
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        spotifyId: null,
        partnerId: null,
      });
    }
  }, [state.spotifyId]);

  const refreshUser = useCallback(async () => {
    if (!state.spotifyId) return;

    try {
      const response = await api.getMe(state.spotifyId);
      
      const user: StoredUser = {
        id: response.user.id,
        spotifyId: response.user.id,
        displayName: response.user.displayName,
        email: response.user.email,
        images: response.user.images,
        partnerId: response.partnerId,
      };

      await setStoredUser(user);

      setState((prev) => ({
        ...prev,
        user,
        partnerId: response.partnerId,
      }));
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, [state.spotifyId]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
