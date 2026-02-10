import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { Colors } from '../../src/constants/colors';
import { Button } from '../../src/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { secureStorage } from '../../src/utils/storage';

export default function BiometricSetupScreen() {
  const router = useRouter();
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setIsBiometricAvailable(hasHardware && isEnrolled);
  };

  const handleEnableBiometric = async () => {
    setLoading(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric authentication',
        fallbackLabel: 'Use PIN',
      });

      if (result.success) {
        await secureStorage.setBiometricEnabled(true);
        Alert.alert('Success', 'Biometric authentication enabled', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/home') },
        ]);
      } else {
        Alert.alert('Failed', 'Biometric authentication failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to enable biometric authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="finger-print" size={100} color={Colors.primary} />
        </View>

        <Text style={styles.title}>Enable Biometric Authentication</Text>
        <Text style={styles.subtitle}>
          {isBiometricAvailable
            ? 'Use your fingerprint or face to quickly and securely access your wallet'
            : 'Biometric authentication is not available on this device'}
        </Text>

        {isBiometricAvailable ? (
          <>
            <Button
              title="Enable Biometric"
              onPress={handleEnableBiometric}
              loading={loading}
              style={styles.button}
            />
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Button title="Continue" onPress={handleSkip} style={styles.button} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 24,
  },
  button: {
    width: '100%',
    marginBottom: 16,
  },
  skipText: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
  },
});