import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Transaction } from '../../src/types';
import { apiService } from '../../src/services/api';
import { format } from 'date-fns';
import { Button } from '../../src/components/Button';

export default function TransactionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const loadTransaction = async () => {
    try {
      const response = await apiService.getTransaction(id as string);
      if (response.data.success) {
        setTransaction(response.data.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load transaction details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    Alert.alert('Coming Soon', 'Receipt download will be available soon');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Transaction not found</Text>
      </SafeAreaView>
    );
  }

  const isReceive = transaction.type === 'receive' || transaction.type === 'deposit';
  const statusColor = {
    pending: Colors.warning,
    completed: Colors.success,
    failed: Colors.error,
  }[transaction.status];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Transaction Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Section */}
        <View style={styles.statusSection}>
          <View style={[styles.statusIcon, { backgroundColor: statusColor + '20' }]}>
            <Ionicons
              name={transaction.status === 'completed' ? 'checkmark-circle' : 'time'}
              size={64}
              color={statusColor}
            />
          </View>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {transaction.status.toUpperCase()}
          </Text>
        </View>

        {/* Amount Section */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>{isReceive ? 'Received' : 'Sent'}</Text>
          <Text style={[styles.amount, { color: isReceive ? Colors.success : Colors.text }]}>
            {isReceive ? '+' : '-'}{transaction.currency} {transaction.amount.toFixed(2)}
          </Text>
          {transaction.fee > 0 && (
            <Text style={styles.fee}>Fee: {transaction.currency} {transaction.fee.toFixed(2)}</Text>
          )}
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.detailValue}>{transaction.id}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {format(new Date(transaction.createdAt), 'MMM dd, yyyy - hh:mm a')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{transaction.type.toUpperCase()}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Method</Text>
            <Text style={styles.detailValue}>{transaction.method}</Text>
          </View>

          {transaction.recipientName && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Recipient</Text>
              <Text style={styles.detailValue}>{transaction.recipientName}</Text>
            </View>
          )}

          {transaction.recipientEmail && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Recipient Email</Text>
              <Text style={styles.detailValue}>{transaction.recipientEmail}</Text>
            </View>
          )}

          {transaction.senderName && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sender</Text>
              <Text style={styles.detailValue}>{transaction.senderName}</Text>
            </View>
          )}

          {transaction.description && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{transaction.description}</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        {transaction.status === 'completed' && (
          <Button
            title="Download Receipt"
            onPress={handleDownloadReceipt}
            variant="outline"
            style={styles.downloadButton}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 100,
  },
  statusSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  statusIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  amount: {
    fontSize: 40,
    fontWeight: '700',
  },
  fee: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  detailRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  downloadButton: {
    marginTop: 8,
  },
});