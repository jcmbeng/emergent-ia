import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Transaction } from '../types';
import { format } from 'date-fns';

interface TransactionCardProps {
  transaction: Transaction;
  onPress: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onPress }) => {
  const { colors } = useTheme();
  const isReceive = transaction.type === 'receive' || transaction.type === 'deposit';
  const iconName = {
    send: 'arrow-up-circle',
    receive: 'arrow-down-circle',
    deposit: 'wallet',
    withdraw: 'cash',
  }[transaction.type] as keyof typeof Ionicons.glyphMap;

  const statusColor = {
    pending: colors.warning,
    completed: colors.success,
    failed: colors.error,
  }[transaction.status];

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.surface }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: (isReceive ? colors.success : colors.error) + '20' }]}>
          <Ionicons
            name={iconName}
            size={24}
            color={isReceive ? colors.success : colors.error}
          />
        </View>
        <View style={styles.details}>
          <Text style={[styles.title, { color: colors.text }]}>
            {transaction.type === 'send' && transaction.recipientName}
            {transaction.type === 'receive' && transaction.senderName}
            {transaction.type === 'deposit' && 'Deposit'}
            {transaction.type === 'withdraw' && 'Withdraw'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {format(new Date(transaction.createdAt), 'MMM dd, yyyy • hh:mm a')}
          </Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: isReceive ? colors.success : colors.text }]}>
            {isReceive ? '+' : '-'}{transaction.currency} {transaction.amount.toFixed(2)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {transaction.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});