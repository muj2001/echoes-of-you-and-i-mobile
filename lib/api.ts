/**
 * API Client for Echoes of You and I
 * 
 * All endpoints require spotifyId for authentication
 */

// Use environment variable or default to local development
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export interface User {
  id: string;
  displayName: string;
  email?: string;
  images?: { url: string }[];
}

export interface AuthMeResponse {
  user: User;
  partnerId: string | null;
  tokenExpiresAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  trackCount: number;
  image: string | null;
  owner: string;
  collaborative: boolean;
}

export interface Track {
  id: string;
  name: string;
  uri: string;
  durationMs: number;
  artists: string;
  album: string;
  albumImage: string | null;
  addedAt: string;
  addedBy: string;
}

export interface Invite {
  code: string;
  url: string;
  expiresAt: string;
  createdAt?: string;
  status?: string;
  inviter?: {
    spotifyId: string;
    displayName: string;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  getLoginUrl(): string {
    return `${this.baseUrl}/auth/login`;
  }

  async getMe(spotifyId: string): Promise<AuthMeResponse> {
    return this.request(`/auth/me?spotifyId=${encodeURIComponent(spotifyId)}`);
  }

  async logout(spotifyId: string): Promise<void> {
    await this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ spotifyId }),
    });
  }

  // Playlist endpoints
  async getPlaylists(spotifyId: string): Promise<{ playlists: Playlist[] }> {
    return this.request(`/playlists?spotifyId=${encodeURIComponent(spotifyId)}`);
  }

  async createPlaylist(
    spotifyId: string,
    name: string
  ): Promise<{ message: string; playlist: Playlist }> {
    return this.request('/playlists', {
      method: 'POST',
      body: JSON.stringify({ spotifyId, name }),
    });
  }

  async getPlaylist(
    playlistId: string,
    spotifyId: string
  ): Promise<{ playlist: Playlist }> {
    return this.request(
      `/playlists/${playlistId}?spotifyId=${encodeURIComponent(spotifyId)}`
    );
  }

  async getPlaylistTracks(
    playlistId: string,
    spotifyId: string
  ): Promise<{ playlistId: string; trackCount: number; tracks: Track[] }> {
    return this.request(
      `/playlists/${playlistId}/tracks?spotifyId=${encodeURIComponent(spotifyId)}`
    );
  }

  // Invite endpoints
  async createInvite(spotifyId: string): Promise<{ message: string; invite: Invite }> {
    return this.request('/invites', {
      method: 'POST',
      body: JSON.stringify({ spotifyId }),
    });
  }

  async getMyInvites(spotifyId: string): Promise<{ invites: Invite[] }> {
    return this.request(`/invites/mine?spotifyId=${encodeURIComponent(spotifyId)}`);
  }

  async getInvite(code: string): Promise<{ invite: Invite }> {
    return this.request(`/invites/${code}`);
  }

  async acceptInvite(
    code: string,
    spotifyId: string
  ): Promise<{ message: string; partnership: { partner: User } }> {
    return this.request(`/invites/${code}/accept`, {
      method: 'POST',
      body: JSON.stringify({ spotifyId }),
    });
  }

  async declineInvite(code: string, spotifyId: string): Promise<{ message: string }> {
    return this.request(`/invites/${code}/decline`, {
      method: 'POST',
      body: JSON.stringify({ spotifyId }),
    });
  }
}

export const api = new ApiClient();
