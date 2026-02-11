import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/contexts/ThemeContext';
import { useWalletStore } from '../src/stores/walletStore';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';

// Format XAF currency
const formatCFA = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function SavingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { wallets } = useWalletStore();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferType, setTransferType] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const savingsAccount = useMemo(() => 
    wallets.find(w => w.type === 'savings'),
  [wallets]);

  const currentAccount = useMemo(() => 
    wallets.find(w => w.type === 'current' && w.currency === 'XAF'),
  [wallets]);

  // Mock savings stats
  const savingsStats = {
    monthlyInterest: Math.round((savingsAccount?.balance || 0) * 0.035 / 12),
    totalEarned: 45000, // Mock accumulated interest
    savingsGoal: 5000000,
    goalProgress: ((savingsAccount?.balance || 0) / 5000000) * 100,
  };

  const handleTransfer = async () => {
    const transferAmount = parseInt(amount.replace(/\s/g, ''));
    if (!transferAmount || transferAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (transferType === 'deposit' && transferAmount > (currentAccount?.balance || 0)) {
      Alert.alert('Error', 'Insufficient balance in current account');
      return;
    }

    if (transferType === 'withdraw' && transferAmount > (savingsAccount?.balance || 0)) {
      Alert.alert('Error', 'Insufficient balance in savings account');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    Alert.alert(
      'Success',
      `${formatCFA(transferAmount)} XAF ${transferType === 'deposit' ? 'deposited to' : 'withdrawn from'} savings`,
      [{ text: 'OK', onPress: () => { setShowTransferModal(false); setAmount(''); } }]
    );
    setLoading(false);
  };

  const openTransferModal = (type: 'deposit' | 'withdraw') => {
    setTransferType(type);
    setAmount('');
    setShowTransferModal(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.surface }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Savings Account</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Savings Balance Card */}
        <LinearGradient
          colors={[colors.success, '#00D4AA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.cardHeader}>
            <View style={styles.savingsIconContainer}>
              <Ionicons name="trending-up" size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.cardLabel}>Savings Balance</Text>
              <Text style={styles.interestRate}>{savingsAccount?.interestRate || 3.5}% annual interest</Text>
            </View>
          </View>
          <Text style={styles.balance}>{formatCFA(savingsAccount?.balance || 0)} XAF</Text>
          
          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => openTransferModal('deposit')}
            >
              <Ionicons name="add-circle" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => openTransferModal('withdraw')}
            >
              <Ionicons name="remove-circle" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{formatCFA(savingsStats.monthlyInterest)} XAF</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Monthly Interest</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="gift" size={24} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.text }]}>{formatCFA(savingsStats.totalEarned)} XAF</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Earned</Text>
          </View>
        </View>

        {/* Savings Goal */}
        <View style={[styles.goalCard, { backgroundColor: colors.surface }]}>
          <View style={styles.goalHeader}>
            <Text style={[styles.goalTitle, { color: colors.text }]}>Savings Goal</Text>
            <Text style={[styles.goalProgress, { color: colors.primary }]}>
              {savingsStats.goalProgress.toFixed(0)}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: colors.success,
                  width: `${Math.min(savingsStats.goalProgress, 100)}%`,
                }
              ]} 
            />
          </View>
          <View style={styles.goalDetails}>
            <Text style={[styles.goalAmount, { color: colors.textSecondary }]}>
              {formatCFA(savingsAccount?.balance || 0)} XAF
            </Text>
            <Text style={[styles.goalTarget, { color: colors.textSecondary }]}>
              of {formatCFA(savingsStats.savingsGoal)} XAF
            </Text>
          </View>
        </View>

        {/* Features */}
        <View style={[styles.featuresCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.featuresSectionTitle, { color: colors.text }]}>Account Benefits</Text>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.success + '20' }]}>
              <Ionicons name="shield-checkmark" size={20} color={colors.success} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Secure Savings</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Your savings are protected and insured
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="trending-up" size={20} color={colors.primary} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Competitive Interest</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Earn {savingsAccount?.interestRate || 3.5}% annual interest on your balance
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: colors.warning + '20' }]}>
              <Ionicons name="flash" size={20} color={colors.warning} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Instant Access</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Withdraw to your current account anytime
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Transfer Modal */}
      <Modal
        visible={showTransferModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTransferModal(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKeyboard}
          >
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => setShowTransferModal(false)}>
                  <Ionicons name="close" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {transferType === 'deposit' ? 'Deposit to Savings' : 'Withdraw from Savings'}
                </Text>
                <View style={{ width: 28 }} />
              </View>

              <View style={styles.modalBody}>
                <View style={[styles.accountInfo, { backgroundColor: colors.surface }]}>
                  <Ionicons 
                    name={transferType === 'deposit' ? 'wallet' : 'trending-up'} 
                    size={24} 
                    color={colors.primary} 
                  />
                  <View style={styles.accountInfoText}>
                    <Text style={[styles.accountInfoLabel, { color: colors.textSecondary }]}>
                      {transferType === 'deposit' ? 'From Current Account' : 'From Savings Account'}
                    </Text>
                    <Text style={[styles.accountInfoBalance, { color: colors.text }]}>
                      Available: {formatCFA(transferType === 'deposit' ? currentAccount?.balance || 0 : savingsAccount?.balance || 0)} XAF
                    </Text>
                  </View>
                </View>

                <Input
                  label="Amount (XAF)"
                  placeholder="Enter amount"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="number-pad"
                  icon="cash-outline"
                />

                {/* Quick Amount Buttons */}
                <View style={styles.quickAmounts}>
                  {[50000, 100000, 250000, 500000].map((quickAmount) => (
                    <TouchableOpacity
                      key={quickAmount}
                      style={[styles.quickAmountBtn, { backgroundColor: colors.surface }]}
                      onPress={() => setAmount(quickAmount.toString())}
                    >
                      <Text style={[styles.quickAmountText, { color: colors.text }]}>
                        {formatCFA(quickAmount)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Button
                  title={transferType === 'deposit' ? 'Deposit' : 'Withdraw'}
                  onPress={handleTransfer}
                  loading={loading}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  balanceCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  savingsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  interestRate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  balance: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  goalCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalAmount: {
    fontSize: 14,
  },
  goalTarget: {
    fontSize: 14,
  },
  featuresCard: {
    borderRadius: 16,
    padding: 20,
  },
  featuresSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureInfo: {
    flex: 1,
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalKeyboard: {
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalBody: {
    padding: 24,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  accountInfoText: {
    marginLeft: 12,
  },
  accountInfoLabel: {
    fontSize: 13,
  },
  accountInfoBalance: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  quickAmountBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
