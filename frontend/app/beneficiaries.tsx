import React, { useEffect, useState, useMemo } from 'react';
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
import { useTheme } from '../src/contexts/ThemeContext';
import { apiService } from '../src/services/api';
import { useWalletStore } from '../src/stores/walletStore';
import { Beneficiary } from '../src/types';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { Select } from '../src/components/Select';
import { countries, Country, getIbanPlaceholder, formatIban, validateIbanLength } from '../src/constants/countries';
import { banksByCountry, Bank } from '../src/constants/banks';

export default function BeneficiariesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { beneficiaries, setBeneficiaries } = useWalletStore();
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'bank' | 'ewallet' | 'momo_mtn' | 'momo_orange'>('bank');
  
  // Form data state
  const [formData, setFormData] = useState({
    beneficiaryName: '',
    beneficiaryEmail: '',
    beneficiaryPhone: '',
    country: '',
    bankId: '',
    iban: '',
  });

  // Banks for selected country
  const [availableBanks, setAvailableBanks] = useState<Bank[]>([]);

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  // Load banks when country changes
  useEffect(() => {
    if (formData.country && selectedType === 'bank') {
      loadBanksForCountry(formData.country);
    }
  }, [formData.country, selectedType]);

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

  const loadBanksForCountry = async (countryCode: string) => {
    try {
      const response = await apiService.getBanksByCountry(countryCode);
      if (response.data.success) {
        setAvailableBanks(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load banks:', error);
      setAvailableBanks([]);
    }
  };

  const resetForm = () => {
    setFormData({
      beneficiaryName: '',
      beneficiaryEmail: '',
      beneficiaryPhone: '',
      country: '',
      bankId: '',
      iban: '',
    });
    setAvailableBanks([]);
  };

  // Country options for Select
  const countryOptions = useMemo(() => 
    countries.map(c => ({
      label: c.name,
      value: c.code,
      icon: c.flag,
      subtitle: `IBAN: ${c.ibanPrefix}XX...`,
    })),
  []);

  // Bank options for Select
  const bankOptions = useMemo(() => 
    availableBanks.map(b => ({
      label: b.name,
      value: b.id,
      subtitle: b.swiftCode || b.code,
    })),
  [availableBanks]);

  // Get selected country info
  const selectedCountry = useMemo(() => 
    countries.find(c => c.code === formData.country),
  [formData.country]);

  // Get selected bank info
  const selectedBank = useMemo(() => 
    availableBanks.find(b => b.id === formData.bankId),
  [availableBanks, formData.bankId]);

  // Handle IBAN input with country prefix
  const handleIbanChange = (text: string) => {
    // Remove spaces and format
    const cleaned = text.replace(/\s/g, '').toUpperCase();
    
    // If country is selected, ensure IBAN starts with country code
    if (selectedCountry) {
      if (!cleaned.startsWith(selectedCountry.ibanPrefix)) {
        // Auto-prepend country code
        setFormData({ ...formData, iban: selectedCountry.ibanPrefix + cleaned.replace(selectedCountry.ibanPrefix, '') });
        return;
      }
    }
    
    setFormData({ ...formData, iban: cleaned });
  };

  // Format IBAN for display
  const displayIban = useMemo(() => formatIban(formData.iban), [formData.iban]);

  // IBAN validation
  const isIbanValid = useMemo(() => {
    if (!formData.country || !formData.iban) return true; // Don't show error if empty
    return validateIbanLength(formData.iban, formData.country);
  }, [formData.country, formData.iban]);

  const handleAddBeneficiary = async () => {
    // Validation
    if (!formData.beneficiaryName) {
      Alert.alert('Error', 'Beneficiary name is required');
      return;
    }

    if (!formData.beneficiaryEmail) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    if (selectedType === 'bank') {
      if (!formData.country) {
        Alert.alert('Error', 'Please select a country');
        return;
      }
      if (!formData.bankId) {
        Alert.alert('Error', 'Please select a bank');
        return;
      }
      if (!formData.iban) {
        Alert.alert('Error', 'IBAN is required');
        return;
      }
      if (!isIbanValid) {
        Alert.alert('Error', `IBAN must be ${selectedCountry?.ibanLength} characters for ${selectedCountry?.name}`);
        return;
      }
    }

    if ((selectedType === 'momo_mtn' || selectedType === 'momo_orange') && !formData.beneficiaryPhone) {
      Alert.alert('Error', 'Phone number is required for Mobile Money');
      return;
    }

    try {
      const payload = {
        beneficiaryName: formData.beneficiaryName,
        beneficiaryEmail: formData.beneficiaryEmail,
        beneficiaryPhone: formData.beneficiaryPhone,
        accountType: selectedType,
        country: formData.country,
        countryName: selectedCountry?.name,
        bankId: formData.bankId,
        bankName: selectedBank?.name,
        swiftCode: selectedBank?.swiftCode,
        iban: formData.iban,
        accountNumber: formData.iban,
      };

      const response = await apiService.addBeneficiary(payload);
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
      case 'bank': return 'business';
      case 'ewallet': return 'wallet';
      case 'momo_mtn': return 'phone-portrait';
      case 'momo_orange': return 'phone-portrait';
      default: return 'person';
    }
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'bank': return 'Bank Account';
      case 'ewallet': return 'e-Wallet';
      case 'momo_mtn': return 'MTN MoMo';
      case 'momo_orange': return 'Orange Money';
      default: return type;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'bank': return colors.info;
      case 'ewallet': return colors.primary;
      case 'momo_mtn': return colors.mtnYellow;
      case 'momo_orange': return colors.orangeColor;
      default: return colors.textSecondary;
    }
  };

  // Get country flag for beneficiary
  const getCountryFlag = (countryCode?: string) => {
    const country = countries.find(c => c.code === countryCode);
    return country?.flag || '🏦';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.surface }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Beneficiaries</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Ionicons name="add-circle" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Beneficiaries List */}
        {loading ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Loading...</Text>
        ) : beneficiaries.length > 0 ? (
          beneficiaries.map((beneficiary) => (
            <View key={beneficiary.id} style={[styles.beneficiaryCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.beneficiaryAvatar, { backgroundColor: getAccountTypeColor(beneficiary.accountType) }]}>
                {beneficiary.accountType === 'bank' ? (
                  <Text style={styles.flagEmoji}>{getCountryFlag(beneficiary.country)}</Text>
                ) : (
                  <Ionicons name={getAccountTypeIcon(beneficiary.accountType) as any} size={24} color="#FFFFFF" />
                )}
              </View>
              <View style={styles.beneficiaryInfo}>
                <Text style={[styles.beneficiaryName, { color: colors.text }]}>{beneficiary.beneficiaryName}</Text>
                <Text style={[styles.beneficiaryType, { color: colors.primary }]}>
                  {getAccountTypeLabel(beneficiary.accountType)}
                </Text>
                {beneficiary.beneficiaryEmail && (
                  <Text style={[styles.beneficiaryDetail, { color: colors.textSecondary }]}>
                    {beneficiary.beneficiaryEmail}
                  </Text>
                )}
                {beneficiary.bankName && (
                  <Text style={[styles.beneficiaryDetail, { color: colors.textSecondary }]}>
                    {beneficiary.bankName} • {beneficiary.countryName || beneficiary.country}
                  </Text>
                )}
                {beneficiary.iban && (
                  <Text style={[styles.ibanText, { color: colors.textTertiary }]}>
                    {formatIban(beneficiary.iban)}
                  </Text>
                )}
                {beneficiary.beneficiaryPhone && (
                  <Text style={[styles.beneficiaryDetail, { color: colors.textSecondary }]}>
                    {beneficiary.beneficiaryPhone}
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={() => handleDeleteBeneficiary(beneficiary.id, beneficiary.beneficiaryName)}>
                <Ionicons name="trash-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No beneficiaries yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>Add people you frequently send money to</Text>
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
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => { setShowAddModal(false); resetForm(); }}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Beneficiary</Text>
            <View style={{ width: 28 }} />
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView contentContainerStyle={styles.modalContent}>
              {/* Account Type Selection */}
              <Text style={[styles.sectionLabel, { color: colors.text }]}>Account Type</Text>
              <View style={styles.typeGrid}>
                <TouchableOpacity
                  style={[
                    styles.typeCard,
                    { backgroundColor: colors.surface },
                    selectedType === 'bank' && { borderColor: colors.info, backgroundColor: colors.info + '10' },
                  ]}
                  onPress={() => { setSelectedType('bank'); resetForm(); }}
                >
                  <Ionicons
                    name="business"
                    size={28}
                    color={selectedType === 'bank' ? colors.info : colors.textSecondary}
                  />
                  <Text style={[styles.typeLabel, { color: selectedType === 'bank' ? colors.info : colors.textSecondary }]}>
                    Bank Account
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeCard,
                    { backgroundColor: colors.surface },
                    selectedType === 'ewallet' && { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
                  ]}
                  onPress={() => { setSelectedType('ewallet'); resetForm(); }}
                >
                  <Ionicons
                    name="wallet"
                    size={28}
                    color={selectedType === 'ewallet' ? colors.primary : colors.textSecondary}
                  />
                  <Text style={[styles.typeLabel, { color: selectedType === 'ewallet' ? colors.primary : colors.textSecondary }]}>
                    e-Wallet
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeCard,
                    { backgroundColor: colors.surface },
                    selectedType === 'momo_mtn' && { borderColor: colors.mtnYellow, backgroundColor: colors.mtnYellow + '10' },
                  ]}
                  onPress={() => { setSelectedType('momo_mtn'); resetForm(); }}
                >
                  <Ionicons
                    name="phone-portrait"
                    size={28}
                    color={selectedType === 'momo_mtn' ? colors.mtnYellow : colors.textSecondary}
                  />
                  <Text style={[styles.typeLabel, { color: selectedType === 'momo_mtn' ? colors.mtnYellow : colors.textSecondary }]}>
                    MTN MoMo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeCard,
                    { backgroundColor: colors.surface },
                    selectedType === 'momo_orange' && { borderColor: colors.orangeColor, backgroundColor: colors.orangeColor + '10' },
                  ]}
                  onPress={() => { setSelectedType('momo_orange'); resetForm(); }}
                >
                  <Ionicons
                    name="phone-portrait"
                    size={28}
                    color={selectedType === 'momo_orange' ? colors.orangeColor : colors.textSecondary}
                  />
                  <Text style={[styles.typeLabel, { color: selectedType === 'momo_orange' ? colors.orangeColor : colors.textSecondary }]}>
                    Orange Money
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Common Fields */}
              <View style={styles.form}>
                <Input
                  label="Full Name"
                  placeholder="Enter beneficiary's full name"
                  value={formData.beneficiaryName}
                  onChangeText={(text) => setFormData({ ...formData, beneficiaryName: text })}
                  icon="person-outline"
                />

                <Input
                  label="Email Address"
                  placeholder="Enter email address"
                  value={formData.beneficiaryEmail}
                  onChangeText={(text) => setFormData({ ...formData, beneficiaryEmail: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon="mail-outline"
                />

                {/* Bank Account Specific Fields */}
                {selectedType === 'bank' && (
                  <>
                    <Select
                      label="Country"
                      placeholder="Select country"
                      value={formData.country}
                      options={countryOptions}
                      onValueChange={(value) => {
                        setFormData({ ...formData, country: value, bankId: '', iban: value ? countries.find(c => c.code === value)?.ibanPrefix || '' : '' });
                      }}
                      searchable
                    />

                    <Select
                      label="Bank"
                      placeholder={formData.country ? "Select bank" : "Select country first"}
                      value={formData.bankId}
                      options={bankOptions}
                      onValueChange={(value) => setFormData({ ...formData, bankId: value })}
                      searchable
                      disabled={!formData.country}
                    />

                    {formData.country && (
                      <View>
                        <Input
                          label={`IBAN (${selectedCountry?.ibanLength} characters)`}
                          placeholder={getIbanPlaceholder(formData.country)}
                          value={displayIban}
                          onChangeText={handleIbanChange}
                          autoCapitalize="characters"
                          icon="card-outline"
                          error={!isIbanValid && formData.iban ? `IBAN must be ${selectedCountry?.ibanLength} characters` : undefined}
                        />
                        <View style={[styles.ibanHelper, { backgroundColor: colors.surface }]}>
                          <Ionicons name="information-circle" size={16} color={colors.primary} />
                          <Text style={[styles.ibanHelperText, { color: colors.textSecondary }]}>
                            IBAN starts with country code: {selectedCountry?.ibanPrefix}
                          </Text>
                        </View>
                      </View>
                    )}
                  </>
                )}

                {/* Mobile Money Specific Fields */}
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

                {/* e-Wallet - just needs email which is already collected above */}
                {selectedType === 'ewallet' && (
                  <View style={[styles.infoBox, { backgroundColor: colors.primary + '10' }]}>
                    <Ionicons name="information-circle" size={20} color={colors.primary} />
                    <Text style={[styles.infoText, { color: colors.primary }]}>
                      The email address will be used to identify the e-Wallet account.
                    </Text>
                  </View>
                )}

                <Button title="Add Beneficiary" onPress={handleAddBeneficiary} style={styles.submitButton} />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
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
    paddingBottom: 24,
  },
  beneficiaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  flagEmoji: {
    fontSize: 24,
  },
  beneficiaryInfo: {
    flex: 1,
    marginLeft: 16,
  },
  beneficiaryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  beneficiaryType: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  beneficiaryDetail: {
    fontSize: 13,
    marginTop: 2,
  },
  ibanText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 64,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
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
    fontSize: 20,
    fontWeight: '700',
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
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
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    marginTop: 8,
  },
  ibanHelper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: -8,
    marginBottom: 16,
    gap: 8,
  },
  ibanHelperText: {
    fontSize: 13,
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  submitButton: {
    marginTop: 16,
  },
});
