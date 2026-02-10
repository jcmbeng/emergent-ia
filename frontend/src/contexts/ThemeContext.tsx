import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  colors: typeof Colors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Premium Fintech Color Palette - Light Mode (Default)
const LightColors = {
  primary: '#0066FF',        // Electric Blue - buttons, CTAs
  primaryDark: '#0052CC',
  primaryLight: '#338FFF',
  accent: '#00B894',         // Teal - highlights, active states
  secondary: '#00D4AA',
  background: '#FFFFFF',     // Clean White
  backgroundLight: '#F6F8FA',
  surface: '#F6F8FA',        // Light Gray - cards
  surfaceLight: '#FFFFFF',
  card: '#F6F8FA',
  error: '#EF4444',          // Coral Red
  warning: '#F59E0B',        // Amber Gold
  success: '#10B981',        // Emerald Green
  info: '#3B82F6',           // Sky Blue
  text: '#1A1A2E',           // Deep Black
  textSecondary: '#6B7280',  // Muted Gray
  textTertiary: '#9CA3AF',
  textLight: '#9CA3AF',
  border: '#E1E4E8',         // Soft Gray
  divider: '#E1E4E8',
  disabled: '#D1D5DB',
  placeholder: '#9CA3AF',
  gradient1: '#0066FF',
  gradient2: '#00D4AA',
  // Mobile Money Colors
  mtnYellow: '#FFCC00',
  orangeColor: '#FF6600',
};

// Premium Fintech Color Palette - Dark Mode
const DarkColors = {
  primary: '#0066FF',        // Electric Blue
  primaryDark: '#0052CC',
  primaryLight: '#338FFF',
  accent: '#00D4AA',         // Cyan Glow
  secondary: '#00D4AA',
  background: '#0D1117',     // Deep Navy
  backgroundLight: '#161B22',
  surface: '#161B22',        // Charcoal - cards
  surfaceLight: '#1C2128',
  card: '#161B22',
  error: '#EF4444',          // Coral Red
  warning: '#F59E0B',        // Amber Gold
  success: '#10B981',        // Emerald Green
  info: '#3B82F6',           // Sky Blue
  text: '#FFFFFF',           // Pure White
  textSecondary: '#8B949E',  // Cool Gray
  textTertiary: '#6E7681',
  textLight: '#6E7681',
  border: '#30363D',         // Slate
  divider: '#30363D',
  disabled: '#484F58',
  placeholder: '#6E7681',
  gradient1: '#0066FF',
  gradient2: '#00D4AA',
  // Mobile Money Colors
  mtnYellow: '#FFCC00',
  orangeColor: '#FF6600',
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('app_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem('app_theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? LightColors : DarkColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};