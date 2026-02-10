import React, { useState, useEffect } from 'react';
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
import { useTheme } from '../../src/contexts/ThemeContext';
import { TransactionCard } from '../../src/components/TransactionCard';
import { useWalletStore } from '../../src/stores/walletStore';
import { apiService } from '../../src/services/api';

export default function TransactionsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { transactions, setTransactions } = useWalletStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'send' | 'receive' | 'deposit' | 'withdraw'>('all');

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  const loadTransactions = async () => {
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await apiService.getTransactions(params);
      if (response.data.success) {
        setTransactions(response.data.data.transactions || response.data.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Transactions</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {(['all', 'send', 'receive', 'deposit', 'withdraw'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterChip,
              { 
                backgroundColor: filter === type ? colors.primary : colors.surface,
                borderColor: filter === type ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setFilter(type)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: filter === type ? '#FFFFFF' : colors.text },
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transactions List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {loading ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Loading...</Text>
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onPress={() => router.push(`/transaction/${transaction.id}`)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions found</Text>
          </View>
        )}
      </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  filterContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 64,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 16,
  },
});
