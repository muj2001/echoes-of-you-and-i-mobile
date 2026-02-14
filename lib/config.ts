/**
 * App Configuration
 * 
 * Handles API URL resolution for different environments:
 * - Development on simulator: localhost works
 * - Development on physical device: uses Expo's hostUri to get local IP
 * - Production: uses environment variable
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

const BACKEND_PORT = 3000;

function getApiUrl(): string {
  // If explicitly set via environment variable, use that
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // In development, derive from Expo's dev server
  if (__DEV__) {
    // Get the host URI from Expo (e.g., "192.168.1.100:8081")
    const hostUri = Constants.expoConfig?.hostUri;
    
    if (hostUri) {
      // Extract just the IP/hostname (remove the port)
      const host = hostUri.split(':')[0];
      return `http://${host}:${BACKEND_PORT}`;
    }

    // Fallback for simulators/emulators
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to reach host machine's localhost
      return `http://10.0.2.2:${BACKEND_PORT}`;
    }
    
    // iOS simulator can use localhost
    return `http://localhost:${BACKEND_PORT}`;
  }

  // Production fallback
  return 'https://your-production-api.com';
}

export const config = {
  apiUrl: getApiUrl(),
  backendPort: BACKEND_PORT,
};

// Log the resolved URL in development
if (__DEV__) {
  console.log('📡 API URL:', config.apiUrl);
}
