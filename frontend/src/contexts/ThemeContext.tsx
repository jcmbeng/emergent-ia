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

const LightColors = {
  primary: '#0066FF',
  primaryDark: '#0052CC',
  primaryLight: '#338FFF',
  secondary: '#00D66F',
  background: '#F5F5F5',
  backgroundLight: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceLight: '#FAFAFA',
  card: '#FFFFFF',
  error: '#FF3B30',
  warning: '#FFCC00',
  success: '#00D66F',
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#E0E0E0',
  disabled: '#CCCCCC',
  placeholder: '#999999',
  gradient1: '#0066FF',
  gradient2: '#00D66F',
};

const DarkColors = {
  primary: '#0066FF',
  primaryDark: '#0052CC',
  primaryLight: '#338FFF',
  secondary: '#00D66F',
  background: '#000000',
  backgroundLight: '#1A1A1A',
  surface: '#242424',
  surfaceLight: '#2D2D2D',
  card: '#1E1E1E',
  error: '#FF3B30',
  warning: '#FFCC00',
  success: '#00D66F',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#636366',
  border: '#3A3A3C',
  disabled: '#48484A',
  placeholder: '#636366',
  gradient1: '#0066FF',
  gradient2: '#00D66F',
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