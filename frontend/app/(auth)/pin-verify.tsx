import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { useAuth } from '../../src/contexts/AuthContext';

export default function PinVerifyScreen() {
  const router = useRouter();
  const { verifyPin, authenticateWithBiometrics } = useAuth();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNumberPress = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        handleVerifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleVerifyPin = async (pinToVerify: string) => {
    setLoading(true);
    try {
      const isValid = await verifyPin(pinToVerify);
      if (isValid) {
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Error', 'Invalid PIN. Please try again.');
        setPin('');
      }
    } catch (error) {
      Alert.alert('Error', 'PIN verification failed');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    const success = await authenticateWithBiometrics();
    if (success) {
      router.replace('/(tabs)/home');
    } else {
      Alert.alert('Error', 'Biometric authentication failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Enter Your PIN</Text>
          <Text style={styles.subtitle}>Enter your 6-digit PIN to continue</Text>
        </View>

        <View style={styles.pinDisplay}>
          {[...Array(6)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.pinDot,
                pin.length > i && styles.pinDotFilled,
              ]}
            />
          ))}
        </View>

        <View style={styles.keypad}>
          {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['bio', '0', 'del']].map(
            (row, rowIndex) => (
              <View key={rowIndex} style={styles.keypadRow}>
                {row.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.key}
                    onPress={() => {
                      if (key === 'del') handleDelete();
                      else if (key === 'bio') handleBiometric();
                      else handleNumberPress(key);
                    }}
                    disabled={loading}
                  >
                    <Text style={styles.keyText}>
                      {key === 'del' ? '⌫' : key === 'bio' ? '🔒' : key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot PIN?</Text>
        </TouchableOpacity>
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
  },
  header: {
    marginTop: 48,
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  pinDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 64,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  pinDotFilled: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  keypad: {
    flex: 1,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  key: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keyText: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
  },
  forgotText: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
});