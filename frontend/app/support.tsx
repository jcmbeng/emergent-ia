import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useTheme } from '../src/contexts/ThemeContext';

export default function SupportScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  // Replace with your actual support URL
  const supportUrl = 'https://support.example.com';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <WebView
        source={{ uri: supportUrl }}
        style={styles.webview}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});