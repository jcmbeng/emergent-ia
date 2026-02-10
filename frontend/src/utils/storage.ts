import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const PIN_KEY = 'user_pin';
const BIOMETRIC_KEY = 'biometric_enabled';

// SecureStore doesn't work on web, so we use AsyncStorage as fallback
const isWeb = Platform.OS === 'web';

export const secureStorage = {
  // JWT Token
  async saveToken(token: string): Promise<void> {
    if (isWeb) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  },

  async getToken(): Promise<string | null> {
    if (isWeb) {
      return await AsyncStorage.getItem(TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async removeToken(): Promise<void> {
    if (isWeb) {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  },

  // PIN
  async savePin(pin: string): Promise<void> {
    if (isWeb) {
      await AsyncStorage.setItem(PIN_KEY, pin);
    } else {
      await SecureStore.setItemAsync(PIN_KEY, pin);
    }
  },

  async getPin(): Promise<string | null> {
    if (isWeb) {
      return await AsyncStorage.getItem(PIN_KEY);
    }
    return await SecureStore.getItemAsync(PIN_KEY);
  },

  async removePin(): Promise<void> {
    if (isWeb) {
      await AsyncStorage.removeItem(PIN_KEY);
    } else {
      await SecureStore.deleteItemAsync(PIN_KEY);
    }
  },

  // Biometric
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(BIOMETRIC_KEY, JSON.stringify(enabled));
  },

  async isBiometricEnabled(): Promise<boolean> {
    const value = await AsyncStorage.getItem(BIOMETRIC_KEY);
    return value === 'true';
  },
};