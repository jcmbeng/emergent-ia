import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { useTheme } from '../../src/contexts/ThemeContext';
import { apiService } from '../../src/services/api';
import { useWalletStore } from '../../src/stores/walletStore';

export default function SendScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { selectedWallet, beneficiaries, setBeneficiaries } = useWalletStore();
  const [formData, setFormData] = useState({
    recipientEmail: '',
    recipientName: '',
    amount: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [showBeneficiaries, setShowBeneficiaries] = useState(false);

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const loadBeneficiaries = async () => {
    try {
      const response = await apiService.getBeneficiaries();
      if (response.data.success) {
        setBeneficiaries(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load beneficiaries:', error);
    }
  };

  const selectBeneficiary = (beneficiary: any) => {
    setFormData({
      ...formData,
      recipientEmail: beneficiary.beneficiaryEmail,
      recipientName: beneficiary.beneficiaryName,
    });
    setShowBeneficiaries(false);
  };

  const handleSend = async () => {
    if (!formData.recipientEmail || !formData.amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (amount > (selectedWallet?.balance || 0)) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    Alert.alert(
      'Confirm Transfer',
      `Send ${selectedWallet?.currency} ${amount.toFixed(2)} to ${formData.recipientEmail}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => processSend(amount) },
      ]
    );
  };

  const processSend = async (amount: number) => {
    setLoading(true);
    try {
      const response = await apiService.sendMoney({
        recipientEmail: formData.recipientEmail,
        recipientName: formData.recipientName,
        amount,
        currency: selectedWallet?.currency,
        description: formData.description,
      });

      if (response.data.success) {
        Alert.alert('Success', 'Money sent successfully', [
          { text: 'OK', onPress: () => router.push('/(tabs)/home') },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send money');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Send Money</Text>
            <TouchableOpacity onPress={() => router.push('/beneficiaries')}>
              <Ionicons name="people-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Balance Display */}
          <View style={[styles.balanceCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Available Balance</Text>
            <Text style={[styles.balance, { color: colors.text }]}>
              {selectedWallet?.currency} {selectedWallet?.balance?.toFixed(2) || '0.00'}
            </Text>
          </View>

          {/* Beneficiaries */}
          {beneficiaries.length > 0 && (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => setShowBeneficiaries(!showBeneficiaries)}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Beneficiaries</Text>
                <Ionicons
                  name={showBeneficiaries ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.text}
                />
              </TouchableOpacity>
              {showBeneficiaries && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {beneficiaries.slice(0, 5).map((beneficiary) => (
                    <TouchableOpacity
                      key={beneficiary.id}
                      style={styles.beneficiaryCard}
                      onPress={() => selectBeneficiary(beneficiary)}
                    >
                      <View style={[styles.beneficiaryAvatar, { backgroundColor: colors.primary }]}>
                        <Text style={styles.beneficiaryInitial}>
                          {beneficiary.beneficiaryName.charAt(0)}
                        </Text>
                      </View>
                      <Text style={[styles.beneficiaryName, { color: colors.text }]} numberOfLines={1}>
                        {beneficiary.beneficiaryName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Recipient Email"
              placeholder="Enter recipient email"
              value={formData.recipientEmail}
              onChangeText={(text) => setFormData({ ...formData, recipientEmail: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
            />

            <Input
              label="Recipient Name (Optional)"
              placeholder="Enter recipient name"
              value={formData.recipientName}
              onChangeText={(text) => setFormData({ ...formData, recipientName: text })}
              icon="person-outline"
            />

            <Input
              label="Amount"
              placeholder="0.00"
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text })}
              keyboardType="decimal-pad"
              icon="cash-outline"
            />

            <Input
              label="Description (Optional)"
              placeholder="What's this for?"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              icon="chatbubble-outline"
            />

            <Button
              title="Send Money"
              onPress={handleSend}
              loading={loading}
              style={styles.sendButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
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
    fontSize: 28,
    fontWeight: '700',
  },
  balanceCard: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  balance: {
    fontSize: 28,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  beneficiaryCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 72,
  },
  beneficiaryAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  beneficiaryInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  beneficiaryName: {
    fontSize: 12,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 24,
  },
  sendButton: {
    marginTop: 8,
  },
});
