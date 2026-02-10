import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
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

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { wallets, selectedWallet, transactions, setWallets, setSelectedWallet, setTransactions } = useWalletStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);

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
        setSelectedWallet(Array.isArray(walletData) ? walletData[0] : walletData);
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
          <TouchableOpacity style={styles.profileButton}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: colors.surface }]}>{user?.firstName?.charAt(0)}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.notificationButton, { backgroundColor: colors.surface }]}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Balance Card with Gradient */}
        <LinearGradient
          colors={[Colors.gradient1, Colors.gradient2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
              <Ionicons name={balanceVisible ? 'eye-outline' : 'eye-off-outline'} size={20} color={Colors.surface} />
            </TouchableOpacity>
          </View>
          <Text style={styles.balance}>
            {balanceVisible 
              ? `${selectedWallet?.currency || 'USD'} ${selectedWallet?.balance?.toFixed(2) || '0.00'}`
              : '****'}
          </Text>
          
          {/* Quick Actions Row */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push('/(tabs)/send')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="arrow-up" size={20} color={Colors.gradient1} />
              </View>
              <Text style={styles.actionBtnText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push('/send-to-bank')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="business" size={20} color={Colors.gradient1} />
              </View>
              <Text style={styles.actionBtnText}>Bank</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push('/mobile-money')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="arrow-down" size={20} color={Colors.gradient1} />
              </View>
              <Text style={styles.actionBtnText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() => router.push('/qr/scan')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="qr-code" size={20} color={Colors.gradient1} />
              </View>
              <Text style={styles.actionBtnText}>QR</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Feature Cards */}
        <View style={styles.featuresGrid}>
          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => router.push('/linked-accounts')}
          >
            <View style={[styles.featureIcon, { backgroundColor: '#FFCC00' + '20' }]}>
              <Ionicons name="phone-portrait" size={24} color="#FFCC00" />
            </View>
            <Text style={styles.featureTitle}>Mobile Money</Text>
            <Text style={styles.featureSubtitle}>Link accounts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => router.push('/beneficiaries')}
          >
            <View style={[styles.featureIcon, { backgroundColor: Colors.primary + '20' }]}>
              <Ionicons name="people" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.featureTitle}>Beneficiaries</Text>
            <Text style={styles.featureSubtitle}>Quick access</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <Text style={styles.emptyText}>Loading...</Text>
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
              <Ionicons name="receipt-outline" size={48} color={Colors.textTertiary} />
              <Text style={styles.emptyText}>No transactions yet</Text>
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
    backgroundColor: Colors.background,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.surface,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.surface,
    opacity: 0.9,
    fontWeight: '500',
  },
  balance: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.surface,
    marginBottom: 24,
    letterSpacing: -1,
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
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    color: Colors.surface,
    fontWeight: '600',
  },
  featuresGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  featureCard: {
    flex: 1,
    backgroundColor: Colors.surface,
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
    color: Colors.text,
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
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
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
});