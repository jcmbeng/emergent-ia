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
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { Colors } from '../src/constants/colors';
import { apiService } from '../src/services/api';
import { useWalletStore } from '../src/stores/walletStore';

export default function SendToBankScreen() {
  const router = useRouter();
  const { selectedWallet, beneficiaries, setBeneficiaries } = useWalletStore();
  const [formData, setFormData] = useState({
    beneficiaryName: '',
    bankName: '',
    accountNumber: '',
    amount: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [bankBeneficiaries, setBankBeneficiaries] = useState<any[]>([]);

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const loadBeneficiaries = async () => {
    try {
      const response = await apiService.getBeneficiaries();
      if (response.data.success) {
        const banks = response.data.data.filter((b: any) => b.accountType === 'bank');
        setBankBeneficiaries(banks);
        setBeneficiaries(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load beneficiaries:', error);
    }
  };

  const selectBeneficiary = (beneficiary: any) => {
    setFormData({
      ...formData,
      beneficiaryName: beneficiary.beneficiaryName,
      bankName: beneficiary.bankName || '',
      accountNumber: beneficiary.accountNumber || '',
    });
  };

  const handleSend = async () => {
    if (!formData.beneficiaryName || !formData.bankName || !formData.accountNumber || !formData.amount) {
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
      'Confirm Bank Transfer',
      `Send ${selectedWallet?.currency} ${amount.toFixed(2)} to ${formData.beneficiaryName}?\n\nBank: ${formData.bankName}\nAccount: ${formData.accountNumber}`,
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
        beneficiaryName: formData.beneficiaryName,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        amount,
        currency: selectedWallet?.currency,
        description: formData.description,
        method: 'bank_wire',
      });

      if (response.data.success) {
        Alert.alert('Success', 'Bank transfer initiated successfully', [
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Send to Bank</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Balance Display */}
          <LinearGradient
            colors={[Colors.surface, Colors.backgroundLight]}
            style={styles.balanceCard}
          >
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balance}>
              {selectedWallet?.currency} {selectedWallet?.balance?.toFixed(2) || '0.00'}
            </Text>
          </LinearGradient>

          {/* Bank Beneficiaries */}
          {bankBeneficiaries.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Recipients</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.beneficiariesScroll}>
                {bankBeneficiaries.map((beneficiary) => (
                  <TouchableOpacity
                    key={beneficiary.id}
                    style={styles.beneficiaryChip}
                    onPress={() => selectBeneficiary(beneficiary)}
                  >
                    <View style={styles.beneficiaryAvatar}>
                      <Ionicons name="business" size={20} color={Colors.primary} />
                    </View>
                    <Text style={styles.beneficiaryName} numberOfLines={1}>
                      {beneficiary.beneficiaryName}
                    </Text>
                    <Text style={styles.beneficiaryBank} numberOfLines={1}>
                      {beneficiary.bankName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Recipient Name"
              placeholder="Enter recipient name"
              value={formData.beneficiaryName}
              onChangeText={(text) => setFormData({ ...formData, beneficiaryName: text })}
              icon="person-outline"
            />

            <Input
              label="Bank Name"
              placeholder="Enter bank name"
              value={formData.bankName}
              onChangeText={(text) => setFormData({ ...formData, bankName: text })}
              icon="business-outline"
            />

            <Input
              label="Account Number"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
              keyboardType="number-pad"
              icon="card-outline"
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
              title="Send to Bank Account"
              onPress={handleSend}
              loading={loading}
              style={styles.sendButton}
            />

            <TouchableOpacity 
              style={styles.addBeneficiaryBtn}
              onPress={() => router.push('/beneficiaries')}
            >
              <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.addBeneficiaryText}>Add New Bank Beneficiary</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  balance: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  beneficiariesScroll: {
    paddingLeft: 20,
  },
  beneficiaryChip: {
    width: 100,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  beneficiaryAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  beneficiaryName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  beneficiaryBank: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 20,
  },
  sendButton: {
    marginTop: 8,
  },
  addBeneficiaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    marginTop: 16,
  },
  addBeneficiaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
});