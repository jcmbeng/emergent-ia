import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAuth } from '../src/contexts/AuthContext';
import { Input } from '../src/components/Input';
import { Button } from '../src/components/Button';
import { Select } from '../src/components/Select';
import { countries } from '../src/constants/countries';
import { apiService } from '../src/services/api';

export default function EditProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || 'CM',
        dateOfBirth: user.dateOfBirth || '',
      });
    }
  }, [user]);

  const countryOptions = countries.map(c => ({
    label: c.name,
    value: c.code,
    icon: c.flag,
  }));

  const handleSave = async () => {
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Last name is required');
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.updateProfile(formData);
      if (response.data.success) {
        // Update local user state
        setUser({ ...user, ...formData } as any);
        Alert.alert('Success', 'Profile updated successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.surface }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Avatar */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
              </Text>
            </View>
            <TouchableOpacity style={[styles.changePhotoButton, { backgroundColor: colors.surface }]}>
              <Ionicons name="camera" size={16} color={colors.primary} />
              <Text style={[styles.changePhotoText, { color: colors.primary }]}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Input
                  label="First Name"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                  icon="person-outline"
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label="Last Name"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                  icon="person-outline"
                />
              </View>
            </View>

            <Input
              label="Email Address"
              placeholder="Enter email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
            />

            <Input
              label="Phone Number"
              placeholder="+237 6XX XXX XXX"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
              icon="call-outline"
            />

            <Input
              label="Date of Birth"
              placeholder="DD/MM/YYYY"
              value={formData.dateOfBirth}
              onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
              icon="calendar-outline"
            />

            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Address</Text>

            <Input
              label="Street Address"
              placeholder="Enter your address"
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              icon="location-outline"
            />

            <Input
              label="City"
              placeholder="Enter city"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              icon="business-outline"
            />

            <Select
              label="Country"
              placeholder="Select country"
              value={formData.country}
              options={countryOptions}
              onValueChange={(value) => setFormData({ ...formData, country: value })}
              searchable
            />

            {/* KYC Level Info */}
            <View style={[styles.kycCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.kycIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
              </View>
              <View style={styles.kycInfo}>
                <Text style={[styles.kycTitle, { color: colors.text }]}>KYC Level {user?.kycLevel || 1}</Text>
                <Text style={[styles.kycSubtitle, { color: colors.textSecondary }]}>
                  {user?.kycLevel === 3 ? 'Fully Verified' : 'Upgrade for higher limits'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/kyc')}>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
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
    paddingTop: 24,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  kycCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  kycIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kycInfo: {
    flex: 1,
    marginLeft: 12,
  },
  kycTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  kycSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  saveButton: {
    marginTop: 8,
  },
});
