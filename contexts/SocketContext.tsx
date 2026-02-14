/**
 * SocketContext - Real-time communication with the backend
 * 
 * Handles:
 * - WebSocket connection with Socket.IO
 * - Partner status updates
 * - Listening session sync
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { config } from '@/lib/config';

const SOCKET_URL = config.apiUrl;

export interface PartnerStatus {
  isListening: boolean;
  spotifyId?: string;
  playlistId?: string;
  playlistName?: string;
  trackUri?: string;
  trackName?: string;
  artistName?: string;
  positionMs?: number;
  isPlaying?: boolean;
  updatedAt?: number;
}

export interface SyncCommand {
  trackUri: string;
  trackName: string;
  artistName: string;
  playlistId: string;
  playlistName: string;
  positionMs: number;
}

interface SocketContextValue {
  isConnected: boolean;
  isPartnerOnline: boolean;
  partnerStatus: PartnerStatus | null;
  startListening: (data: {
    playlistId: string;
    playlistName: string;
    trackUri: string;
    trackName: string;
    artistName: string;
    positionMs: number;
  }) => void;
  updateListening: (data: {
    trackUri: string;
    trackName?: string;
    artistName?: string;
    positionMs: number;
    isPlaying: boolean;
  }) => void;
  stopListening: () => void;
  joinPartnerSession: () => void;
  onSyncCommand: (callback: (command: SyncCommand) => void) => () => void;
  onSessionJoined: (callback: (data: { spotifyId: string; message: string }) => void) => () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, spotifyId } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState<PartnerStatus | null>(null);

  // Connect socket when authenticated
  useEffect(() => {
    if (isAuthenticated && spotifyId) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, spotifyId]);

  const connectSocket = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(SOCKET_URL, {
      query: { spotifyId },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('🔌 Socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
      setIsPartnerOnline(false);
      setPartnerStatus(null);
    });

    socket.on('partner:online', (data: { spotifyId: string }) => {
      console.log('💚 Partner online:', data.spotifyId);
      setIsPartnerOnline(true);
    });

    socket.on('partner:offline', (data: { spotifyId: string }) => {
      console.log('⚪ Partner offline:', data.spotifyId);
      setIsPartnerOnline(false);
      setPartnerStatus(null);
    });

    socket.on('partner:status', (data: PartnerStatus) => {
      console.log('🎵 Partner status:', data);
      setPartnerStatus(data);
      if (data.isListening) {
        setIsPartnerOnline(true);
      }
    });

    socketRef.current = socket;
  }, [spotifyId]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setIsPartnerOnline(false);
      setPartnerStatus(null);
    }
  }, []);

  const startListening = useCallback((data: {
    playlistId: string;
    playlistName: string;
    trackUri: string;
    trackName: string;
    artistName: string;
    positionMs: number;
  }) => {
    socketRef.current?.emit('listening:start', data);
  }, []);

  const updateListening = useCallback((data: {
    trackUri: string;
    trackName?: string;
    artistName?: string;
    positionMs: number;
    isPlaying: boolean;
  }) => {
    socketRef.current?.emit('listening:update', data);
  }, []);

  const stopListening = useCallback(() => {
    socketRef.current?.emit('listening:stop');
  }, []);

  const joinPartnerSession = useCallback(() => {
    socketRef.current?.emit('session:join');
  }, []);

  const onSyncCommand = useCallback((callback: (command: SyncCommand) => void) => {
    const handler = (data: SyncCommand) => {
      console.log('🔄 Sync command received:', data);
      callback(data);
    };
    socketRef.current?.on('session:sync', handler);
    return () => {
      socketRef.current?.off('session:sync', handler);
    };
  }, []);

  const onSessionJoined = useCallback((callback: (data: { spotifyId: string; message: string }) => void) => {
    const handler = (data: { spotifyId: string; message: string }) => {
      console.log('💕 Session joined:', data);
      callback(data);
    };
    socketRef.current?.on('session:joined', handler);
    return () => {
      socketRef.current?.off('session:joined', handler);
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        isPartnerOnline,
        partnerStatus,
        startListening,
        updateListening,
        stopListening,
        joinPartnerSession,
        onSyncCommand,
        onSessionJoined,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
