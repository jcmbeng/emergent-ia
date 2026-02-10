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
import { Button } from '../../src/components/Button';
import { Colors } from '../../src/constants/colors';
import { useAuth } from '../../src/contexts/AuthContext';

export default function PinSetupScreen() {
  const router = useRouter();
  const { setupPin } = useAuth();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [loading, setLoading] = useState(false);

  const handleNumberPress = (num: string) => {
    if (step === 'enter') {
      if (pin.length < 6) {
        setPin(pin + num);
        if (pin.length === 5) {
          setTimeout(() => setStep('confirm'), 300);
        }
      }
    } else {
      if (confirmPin.length < 6) {
        const newPin = confirmPin + num;
        setConfirmPin(newPin);
        if (newPin.length === 6) {
          handlePinSetup(newPin);
        }
      }
    }
  };

  const handleDelete = () => {
    if (step === 'enter') {
      setPin(pin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const handlePinSetup = async (confirmedPin: string) => {
    if (pin !== confirmedPin) {
      Alert.alert('Error', 'PINs do not match. Please try again.');
      setPin('');
      setConfirmPin('');
      setStep('enter');
      return;
    }

    setLoading(true);
    try {
      await setupPin(pin);
      Alert.alert('Success', 'PIN has been set successfully', [
        { text: 'OK', onPress: () => router.replace('/(auth)/biometric-setup') },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const currentPin = step === 'enter' ? pin : confirmPin;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {step === 'enter' ? 'Set Your PIN' : 'Confirm Your PIN'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 'enter'
              ? 'Create a 6-digit PIN to secure your wallet'
              : 'Re-enter your PIN to confirm'}
          </Text>
        </View>

        <View style={styles.pinDisplay}>
          {[...Array(6)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.pinDot,
                currentPin.length > i && styles.pinDotFilled,
              ]}
            />
          ))}
        </View>

        <View style={styles.keypad}>
          {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', 'del']].map(
            (row, rowIndex) => (
              <View key={rowIndex} style={styles.keypadRow}>
                {row.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.key}
                    onPress={() => {
                      if (key === 'del') handleDelete();
                      else if (key) handleNumberPress(key);
                    }}
                    disabled={key === '' || loading}
                  >
                    <Text style={styles.keyText}>
                      {key === 'del' ? '⌫' : key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}
        </View>

        {step === 'enter' && (
          <TouchableOpacity onPress={() => router.replace('/(tabs)/home')}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
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
  skipText: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
});