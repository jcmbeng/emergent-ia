import React, { useEffect, useState } from 'react';
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
import { apiService } from '../src/services/api';
import { useWalletStore } from '../src/stores/walletStore';
import { Beneficiary } from '../src/types';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';

export default function BeneficiariesScreen() {
  const router = useRouter();
  const { beneficiaries, setBeneficiaries } = useWalletStore();
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'bank' | 'ewallet' | 'momo_mtn' | 'momo_orange'>('ewallet');
  const [formData, setFormData] = useState({
    beneficiaryName: '',
    beneficiaryEmail: '',
    beneficiaryPhone: '',
    accountNumber: '',
    bankName: '',
    nickname: '',
  });

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
      Alert.alert('Error', 'Failed to load beneficiaries');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      beneficiaryName: '',
      beneficiaryEmail: '',
      beneficiaryPhone: '',
      accountNumber: '',
      bankName: '',
      nickname: '',
    });
  };

  const handleAddBeneficiary = async () => {
    if (!formData.beneficiaryName) {
      Alert.alert('Error', 'Beneficiary name is required');
      return;
    }

    if (selectedType === 'ewallet' && !formData.beneficiaryEmail) {
      Alert.alert('Error', 'Email is required for e-Wallet');
      return;
    }

    if ((selectedType === 'momo_mtn' || selectedType === 'momo_orange') && !formData.beneficiaryPhone) {
      Alert.alert('Error', 'Phone number is required for Mobile Money');
      return;
    }

    if (selectedType === 'bank' && (!formData.accountNumber || !formData.bankName)) {
      Alert.alert('Error', 'Account number and bank name are required');
      return;
    }

    try {
      const response = await apiService.addBeneficiary({
        ...formData,
        accountType: selectedType,
      });
      if (response.data.success) {
        Alert.alert('Success', 'Beneficiary added successfully');
        setShowAddModal(false);
        resetForm();
        loadBeneficiaries();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to add beneficiary');
    }
  };

  const handleDeleteBeneficiary = (id: string, name: string) => {
    Alert.alert('Delete Beneficiary', `Remove ${name} from your beneficiaries?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiService.deleteBeneficiary(id);
            loadBeneficiaries();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete beneficiary');
          }
        },
      },
    ]);
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return 'business';
      case 'ewallet':
        return 'wallet';
      case 'momo_mtn':
        return 'phone-portrait';
      case 'momo_orange':
        return 'phone-portrait';
      default:
        return 'person';
    }
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'bank':
        return 'Bank Account';
      case 'ewallet':
        return 'e-Wallet';
      case 'momo_mtn':
        return 'MTN MoMo';
      case 'momo_orange':
        return 'Orange Money';
      default:
        return type;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'bank':
        return '#3B82F6';
      case 'ewallet':
        return Colors.primary;
      case 'momo_mtn':
        return '#FFCC00';
      case 'momo_orange':
        return '#FF6600';
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Beneficiaries</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Beneficiaries List */}
        {loading ? (
          <Text style={styles.emptyText}>Loading...</Text>
        ) : beneficiaries.length > 0 ? (
          beneficiaries.map((beneficiary) => (
            <View key={beneficiary.id} style={styles.beneficiaryCard}>
              <View
                style={[
                  styles.beneficiaryAvatar,
                  { backgroundColor: getAccountTypeColor(beneficiary.accountType) },
                ]}
              >
                <Ionicons
                  name={getAccountTypeIcon(beneficiary.accountType) as any}
                  size={24}
                  color={Colors.surface}
                />
              </View>
              <View style={styles.beneficiaryInfo}>
                <Text style={styles.beneficiaryName}>{beneficiary.beneficiaryName}</Text>
                <Text style={styles.beneficiaryType}>
                  {getAccountTypeLabel(beneficiary.accountType)}
                </Text>
                {beneficiary.beneficiaryEmail && (
                  <Text style={styles.beneficiaryDetail}>{beneficiary.beneficiaryEmail}</Text>
                )}
                {beneficiary.beneficiaryPhone && (
                  <Text style={styles.beneficiaryDetail}>{beneficiary.beneficiaryPhone}</Text>
                )}
                {beneficiary.accountNumber && (
                  <Text style={styles.beneficiaryDetail}>
                    {beneficiary.bankName} - {beneficiary.accountNumber}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() =>
                  handleDeleteBeneficiary(beneficiary.id, beneficiary.beneficiaryName)
                }
              >
                <Ionicons name="trash-outline" size={20} color={Colors.error} />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>No beneficiaries yet</Text>
            <Text style={styles.emptySubtext}>Add people you frequently send money to</Text>
          </View>
        )}
      </ScrollView>

      {/* Add Beneficiary Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={28} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Beneficiary</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            {/* Account Type Selection */}
            <Text style={styles.sectionLabel}>Select Account Type</Text>
            <View style={styles.typeGrid}>
              <TouchableOpacity
                style={[
                  styles.typeCard,
                  selectedType === 'ewallet' && styles.typeCardActive,
                ]}
                onPress={() => setSelectedType('ewallet')}
              >
                <Ionicons
                  name="wallet"
                  size={32}
                  color={selectedType === 'ewallet' ? Colors.primary : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    selectedType === 'ewallet' && styles.typeLabelActive,
                  ]}
                >
                  e-Wallet
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeCard,
                  selectedType === 'momo_mtn' && styles.typeCardActive,
                ]}
                onPress={() => setSelectedType('momo_mtn')}
              >
                <Ionicons
                  name="phone-portrait"
                  size={32}
                  color={selectedType === 'momo_mtn' ? '#FFCC00' : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    selectedType === 'momo_mtn' && styles.typeLabelActive,
                  ]}
                >
                  MTN MoMo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeCard,
                  selectedType === 'momo_orange' && styles.typeCardActive,
                ]}
                onPress={() => setSelectedType('momo_orange')}
              >
                <Ionicons
                  name="phone-portrait"
                  size={32}
                  color={selectedType === 'momo_orange' ? '#FF6600' : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    selectedType === 'momo_orange' && styles.typeLabelActive,
                  ]}
                >
                  Orange Money
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeCard,
                  selectedType === 'bank' && styles.typeCardActive,
                ]}
                onPress={() => setSelectedType('bank')}
              >
                <Ionicons
                  name="business"
                  size={32}
                  color={selectedType === 'bank' ? '#3B82F6' : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    selectedType === 'bank' && styles.typeLabelActive,
                  ]}
                >
                  Bank Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              <Input
                label="Beneficiary Name"
                placeholder="Enter full name"
                value={formData.beneficiaryName}
                onChangeText={(text) => setFormData({ ...formData, beneficiaryName: text })}
                icon="person-outline"
              />

              {selectedType === 'ewallet' && (
                <>
                  <Input
                    label="Email Address"
                    placeholder="Enter email"
                    value={formData.beneficiaryEmail}
                    onChangeText={(text) => setFormData({ ...formData, beneficiaryEmail: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    icon="mail-outline"
                  />
                  <TouchableOpacity
                    style={styles.scanButton}
                    onPress={() => {
                      setShowAddModal(false);
                      router.push('/qr/scan');
                    }}
                  >
                    <Ionicons name="qr-code" size={20} color={Colors.primary} />
                    <Text style={styles.scanButtonText}>Scan QR Code</Text>
                  </TouchableOpacity>
                </>
              )}

              {(selectedType === 'momo_mtn' || selectedType === 'momo_orange') && (
                <Input
                  label="Phone Number"
                  placeholder="Enter phone number"
                  value={formData.beneficiaryPhone}
                  onChangeText={(text) => setFormData({ ...formData, beneficiaryPhone: text })}
                  keyboardType="phone-pad"
                  icon="call-outline"
                />
              )}

              {selectedType === 'bank' && (
                <>
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
                </>
              )}

              <Input
                label="Nickname (Optional)"
                placeholder="Enter a nickname"
                value={formData.nickname}
                onChangeText={(text) => setFormData({ ...formData, nickname: text })}
                icon="pricetag-outline"
              />

              <Button title="Add Beneficiary" onPress={handleAddBeneficiary} />
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
  beneficiaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  beneficiaryAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beneficiaryInfo: {
    flex: 1,
    marginLeft: 16,
  },
  beneficiaryName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  beneficiaryType: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 2,
  },
  beneficiaryDetail: {
    fontSize: 13,
    color: Colors.textSecondary,
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  typeCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  typeLabelActive: {
    color: Colors.primary,
  },
  form: {
    marginTop: 8,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});