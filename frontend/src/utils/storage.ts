import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const PIN_KEY = 'user_pin';
const BIOMETRIC_KEY = 'biometric_enabled';

export const secureStorage = {
  // JWT Token
  async saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  // PIN
  async savePin(pin: string): Promise<void> {
    await SecureStore.setItemAsync(PIN_KEY, pin);
  },

  async getPin(): Promise<string | null> {
    return await SecureStore.getItemAsync(PIN_KEY);
  },

  async removePin(): Promise<void> {
    await SecureStore.deleteItemAsync(PIN_KEY);
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