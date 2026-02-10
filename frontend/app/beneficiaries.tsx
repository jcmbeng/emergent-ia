import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    beneficiaryName: '',
    beneficiaryEmail: '',
    beneficiaryPhone: '',
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

  const handleAddBeneficiary = async () => {
    if (!formData.beneficiaryName || !formData.beneficiaryEmail) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    try {
      const response = await apiService.addBeneficiary(formData);
      if (response.data.success) {
        Alert.alert('Success', 'Beneficiary added successfully');
        setShowAddForm(false);
        setFormData({
          beneficiaryName: '',
          beneficiaryEmail: '',
          beneficiaryPhone: '',
          nickname: '',
        });
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Beneficiaries</Text>
        <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)}>
          <Ionicons
            name={showAddForm ? 'close' : 'add'}
            size={24}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Add Form */}
        {showAddForm && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Add New Beneficiary</Text>
            <Input
              label="Full Name"
              placeholder="Enter beneficiary name"
              value={formData.beneficiaryName}
              onChangeText={(text) => setFormData({ ...formData, beneficiaryName: text })}
              icon="person-outline"
            />
            <Input
              label="Email"
              placeholder="Enter email address"
              value={formData.beneficiaryEmail}
              onChangeText={(text) => setFormData({ ...formData, beneficiaryEmail: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
            />
            <Input
              label="Phone (Optional)"
              placeholder="Enter phone number"
              value={formData.beneficiaryPhone}
              onChangeText={(text) => setFormData({ ...formData, beneficiaryPhone: text })}
              keyboardType="phone-pad"
              icon="call-outline"
            />
            <Input
              label="Nickname (Optional)"
              placeholder="Enter a nickname"
              value={formData.nickname}
              onChangeText={(text) => setFormData({ ...formData, nickname: text })}
              icon="pricetag-outline"
            />
            <Button title="Add Beneficiary" onPress={handleAddBeneficiary} />
          </View>
        )}

        {/* Beneficiaries List */}
        {loading ? (
          <Text style={styles.emptyText}>Loading...</Text>
        ) : beneficiaries.length > 0 ? (
          beneficiaries.map((beneficiary) => (
            <View key={beneficiary.id} style={styles.beneficiaryCard}>
              <View style={styles.beneficiaryAvatar}>
                <Text style={styles.beneficiaryInitial}>
                  {beneficiary.beneficiaryName.charAt(0)}
                </Text>
              </View>
              <View style={styles.beneficiaryInfo}>
                <Text style={styles.beneficiaryName}>{beneficiary.beneficiaryName}</Text>
                <Text style={styles.beneficiaryEmail}>{beneficiary.beneficiaryEmail}</Text>
                {beneficiary.beneficiaryPhone && (
                  <Text style={styles.beneficiaryPhone}>{beneficiary.beneficiaryPhone}</Text>
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
  addForm: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
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
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  beneficiaryInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.surface,
  },
  beneficiaryInfo: {
    flex: 1,
    marginLeft: 16,
  },
  beneficiaryName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  beneficiaryEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  beneficiaryPhone: {
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
});