import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { secureStorage } from '../utils/storage';
import { apiService } from '../services/api';
import * as LocalAuthentication from 'expo-local-authentication';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setupPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  authenticateWithBiometrics: () => Promise<boolean>;
  sendMfaOtp: () => Promise<void>;
  verifyMfaOtp: (otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await secureStorage.getToken();
      if (token) {
        // Fetch user profile
        const response = await apiService.getWalletBalance();
        if (response.data.success) {
          // User is authenticated
          setUser(response.data.data.user);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await secureStorage.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password);
      const { token, user: userData } = response.data.data;
      await secureStorage.saveToken(token);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (data: any) => {
    try {
      const response = await apiService.register(data);
      const { token, user: userData } = response.data.data;
      await secureStorage.saveToken(token);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await secureStorage.removeToken();
      await secureStorage.removePin();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const setupPin = async (pin: string) => {
    try {
      await apiService.setupPin(pin);
      await secureStorage.savePin(pin);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'PIN setup failed');
    }
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    try {
      const response = await apiService.verifyPin(pin);
      return response.data.success;
    } catch (error) {
      return false;
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        throw new Error('Biometric hardware not available');
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        throw new Error('No biometric data enrolled');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use PIN',
      });

      return result.success;
    } catch (error) {
      console.error('Biometric auth failed:', error);
      return false;
    }
  };

  const sendMfaOtp = async () => {
    try {
      await apiService.sendMfaOtp();
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const verifyMfaOtp = async (otp: string) => {
    try {
      await apiService.verifyMfaOtp(otp);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        setupPin,
        verifyPin,
        authenticateWithBiometrics,
        sendMfaOtp,
        verifyMfaOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};