import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { apiService } from '../src/services/api';
import { useWalletStore } from '../src/stores/walletStore';

export default function MobileMoneyScreen() {
  const router = useRouter();
  const { selectedWallet } = useWalletStore();
  const [provider, setProvider] = useState<'mtn' | 'orange' | null>(null);
  const [type, setType] = useState<'deposit' | 'withdraw' | null>(null);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!provider || !type || !amount || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      let response;
      if (provider === 'mtn') {
        response = type === 'deposit'
          ? await apiService.mtnDeposit(amountValue, phone)
          : await apiService.mtnWithdraw(amountValue, phone);
      } else {
        response = type === 'deposit'
          ? await apiService.orangeDeposit(amountValue, phone)
          : await apiService.orangeWithdraw(amountValue, phone);
      }

      if (response.data.success) {
        Alert.alert('Success', `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} initiated successfully`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Mobile Money</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Provider Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Provider</Text>
          <View style={styles.providerContainer}>
            <TouchableOpacity
              style={[
                styles.providerCard,
                provider === 'mtn' && styles.providerCardActive,
              ]}
              onPress={() => setProvider('mtn')}
            >
              <View style={[styles.providerIcon, { backgroundColor: '#FFCC00' }]}>
                <Text style={styles.providerIconText}>MTN</Text>
              </View>
              <Text style={styles.providerName}>MTN MoMo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.providerCard,
                provider === 'orange' && styles.providerCardActive,
              ]}
              onPress={() => setProvider('orange')}
            >
              <View style={[styles.providerIcon, { backgroundColor: '#FF6600' }]}>
                <Text style={styles.providerIconText}>OM</Text>
              </View>
              <Text style={styles.providerName}>Orange Money</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'deposit' && styles.typeButtonActive,
              ]}
              onPress={() => setType('deposit')}
            >
              <Ionicons
                name="arrow-down-circle"
                size={24}
                color={type === 'deposit' ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.typeText,
                  type === 'deposit' && styles.typeTextActive,
                ]}
              >
                Deposit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                type === 'withdraw' && styles.typeButtonActive,
              ]}
              onPress={() => setType('withdraw')}
            >
              <Ionicons
                name="arrow-up-circle"
                size={24}
                color={type === 'withdraw' ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.typeText,
                  type === 'withdraw' && styles.typeTextActive,
                ]}
              >
                Withdraw
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Phone Number"
            placeholder="Enter mobile money phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            icon="call-outline"
          />

          <Input
            label="Amount"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            icon="cash-outline"
          />

          <Button
            title={`${type === 'deposit' ? 'Deposit' : 'Withdraw'} Funds`}
            onPress={handleSubmit}
            loading={loading}
            disabled={!provider || !type}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  providerContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  providerCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  providerCardActive: {
    borderColor: Colors.primary,
  },
  providerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.surface,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  typeButton: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 8,
  },
  typeButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  typeTextActive: {
    color: Colors.primary,
  },
  form: {
    paddingHorizontal: 24,
  },
});