import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { mockLinkedAccounts, generateId, delay } from '../src/services/mockData';

export default function LinkedAccountsScreen() {
  const router = useRouter();
  const [linkedAccounts, setLinkedAccounts] = useState(mockLinkedAccounts);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'mtn' | 'orange'>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLinkAccount = async () => {
    if (!phoneNumber || !accountName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await delay(1500);
      
      const newAccount = {
        id: generateId(),
        userId: '1',
        provider: selectedProvider,
        phoneNumber,
        accountName,
        isVerified: true,
        isPrimary: linkedAccounts.length === 0,
        createdAt: new Date().toISOString(),
      };

      setLinkedAccounts([...linkedAccounts, newAccount]);
      setShowLinkModal(false);
      setPhoneNumber('');
      setAccountName('');
      Alert.alert('Success', 'Account linked successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to link account');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkAccount = (id: string, provider: string) => {
    Alert.alert(
      'Unlink Account',
      `Remove this ${provider === 'mtn' ? 'MTN' : 'Orange'} account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: () => {
            setLinkedAccounts(linkedAccounts.filter((acc) => acc.id !== id));
          },
        },
      ]
    );
  };

  const handleSetPrimary = (id: string) => {
    setLinkedAccounts(
      linkedAccounts.map((acc) => ({
        ...acc,
        isPrimary: acc.id === id,
      }))
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Linked Accounts</Text>
        <TouchableOpacity onPress={() => setShowLinkModal(true)}>
          <Ionicons name="add" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>
          Link your Mobile Money accounts to quickly add funds and withdraw
        </Text>

        {linkedAccounts.length > 0 ? (
          linkedAccounts.map((account) => (
            <View key={account.id} style={styles.accountCard}>
              <View
                style={[
                  styles.providerIcon,
                  {
                    backgroundColor:
                      account.provider === 'mtn' ? '#FFCC00' : '#FF6600',
                  },
                ]}
              >
                <Text style={styles.providerText}>
                  {account.provider === 'mtn' ? 'MTN' : 'OM'}
                </Text>
              </View>
              <View style={styles.accountInfo}>
                <View style={styles.accountHeader}>
                  <Text style={styles.accountName}>{account.accountName}</Text>
                  {account.isPrimary && (
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryText}>Primary</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.phoneNumber}>{account.phoneNumber}</Text>
                {account.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              <View style={styles.actions}>
                {!account.isPrimary && (
                  <TouchableOpacity onPress={() => handleSetPrimary(account.id)}>
                    <Ionicons name="star-outline" size={20} color={Colors.textSecondary} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleUnlinkAccount(account.id, account.provider)}
                >
                  <Ionicons name="trash-outline" size={20} color={Colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="link-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>No linked accounts</Text>
            <Text style={styles.emptySubtext}>
              Link your Mobile Money accounts for quick transactions
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Link Account Modal */}
      <Modal
        visible={showLinkModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowLinkModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowLinkModal(false)}>
              <Ionicons name="close" size={28} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Link Account</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.sectionLabel}>Select Provider</Text>
            <View style={styles.providerContainer}>
              <TouchableOpacity
                style={[
                  styles.providerCard,
                  selectedProvider === 'mtn' && styles.providerCardActive,
                ]}
                onPress={() => setSelectedProvider('mtn')}
              >
                <View style={[styles.providerIconLarge, { backgroundColor: '#FFCC00' }]}>
                  <Text style={styles.providerTextLarge}>MTN</Text>
                </View>
                <Text style={styles.providerName}>MTN MoMo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.providerCard,
                  selectedProvider === 'orange' && styles.providerCardActive,
                ]}
                onPress={() => setSelectedProvider('orange')}
              >
                <View style={[styles.providerIconLarge, { backgroundColor: '#FF6600' }]}>
                  <Text style={styles.providerTextLarge}>OM</Text>
                </View>
                <Text style={styles.providerName}>Orange Money</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Input
                label="Account Name"
                placeholder="Enter account name"
                value={accountName}
                onChangeText={setAccountName}
                icon="person-outline"
              />

              <Input
                label="Phone Number"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                icon="call-outline"
              />

              <Button
                title="Link Account"
                onPress={handleLinkAccount}
                loading={loading}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.surface,
  },
  accountInfo: {
    flex: 1,
    marginLeft: 16,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  primaryBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  primaryText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  phoneNumber: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.success,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 64,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  providerContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
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
  providerIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerTextLarge: {
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
  form: {
    marginTop: 8,
  },
});