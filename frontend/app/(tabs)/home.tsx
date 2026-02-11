import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { useWalletStore } from '../../src/stores/walletStore';
import { apiService } from '../../src/services/api';
import { TransactionCard } from '../../src/components/TransactionCard';
import { Wallet } from '../../src/types';

// Format XAF currency
const formatCFA = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { wallets, selectedWallet, transactions, setWallets, setSelectedWallet, setTransactions } = useWalletStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);

  // Get current and savings accounts
  const currentAccount = useMemo(() => 
    wallets.find(w => w.type === 'current' && w.currency === 'XAF') || wallets[0],
  [wallets]);
  
  const savingsAccount = useMemo(() => 
    wallets.find(w => w.type === 'savings'),
  [wallets]);

  // Calculate total balance in XAF
  const totalBalance = useMemo(() => {
    const xafWallets = wallets.filter(w => w.currency === 'XAF');
    return xafWallets.reduce((sum, w) => sum + w.balance, 0);
  }, [wallets]);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [walletResponse, transactionsResponse] = await Promise.all([
        apiService.getWalletAccounts(),
        apiService.getTransactions({ limit: 5 }),
      ]);

      if (walletResponse.data.success) {
        const walletData = walletResponse.data.data;
        setWallets(Array.isArray(walletData) ? walletData : [walletData]);
        // Select the XAF current account by default
        const xafWallet = Array.isArray(walletData) 
          ? walletData.find((w: Wallet) => w.currency === 'XAF' && w.type === 'current') || walletData[0]
          : walletData;
        setSelectedWallet(xafWallet);
      }

      if (transactionsResponse.data.success) {
        setTransactions(transactionsResponse.data.data.transactions || transactionsResponse.data.data);
      }
    } catch (error: any) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWalletData();
    setRefreshing(false);
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{user?.firstName?.charAt(0)}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.notificationButton, { backgroundColor: colors.surface }]}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Main Balance Card - Current Account */}
        <LinearGradient
          colors={[colors.gradient1, colors.gradient2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.accountType}>Current Account</Text>
              <Text style={styles.balanceLabel}>Total Balance</Text>
            </View>
            <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
              <Ionicons name={balanceVisible ? 'eye-outline' : 'eye-off-outline'} size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.balance}>
            {balanceVisible 
              ? `${formatCFA(currentAccount?.balance || 0)} XAF`
              : '•••••••• XAF'}
          </Text>
          
          {/* Quick Actions Row */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push('/(tabs)/send')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="arrow-up" size={20} color={colors.gradient1} />
              </View>
              <Text style={styles.actionBtnText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push('/send-to-bank')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="business" size={20} color={colors.gradient1} />
              </View>
              <Text style={styles.actionBtnText}>Bank</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push('/mobile-money')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="arrow-down" size={20} color={colors.gradient1} />
              </View>
              <Text style={styles.actionBtnText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push('/qr/scan')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="qr-code" size={20} color={colors.gradient1} />
              </View>
              <Text style={styles.actionBtnText}>QR</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Savings Account Card */}
        {savingsAccount && (
          <TouchableOpacity 
            style={[styles.savingsCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/savings')}
          >
            <View style={styles.savingsHeader}>
              <View style={[styles.savingsIcon, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="trending-up" size={24} color={colors.success} />
              </View>
              <View style={styles.savingsInfo}>
                <Text style={[styles.savingsTitle, { color: colors.text }]}>Savings Account</Text>
                <Text style={[styles.savingsRate, { color: colors.success }]}>
                  {savingsAccount.interestRate}% annual interest
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
            <View style={styles.savingsBalanceRow}>
              <Text style={[styles.savingsBalance, { color: colors.text }]}>
                {balanceVisible ? `${formatCFA(savingsAccount.balance)} XAF` : '•••••••• XAF'}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Feature Cards */}
        <View style={styles.featuresGrid}>
          <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/linked-accounts')}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.mtnYellow + '20' }]}>
              <Ionicons name="phone-portrait" size={24} color={colors.mtnYellow} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Mobile Money</Text>
            <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>Link accounts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.featureCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/beneficiaries')}
          >
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="people" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Beneficiaries</Text>
            <Text style={[styles.featureSubtitle, { color: colors.textSecondary }]}>Quick access</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Loading...</Text>
          ) : recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onPress={() => router.push(`/transaction/${transaction.id}`)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  accountType: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '500',
  },
  balance: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Savings Account Card
  savingsCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  savingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savingsInfo: {
    flex: 1,
    marginLeft: 12,
  },
  savingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  savingsRate: {
    fontSize: 13,
    fontWeight: '500',
  },
  savingsBalanceRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  savingsBalance: {
    fontSize: 24,
    fontWeight: '700',
  },
  featuresGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  featureCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
});
