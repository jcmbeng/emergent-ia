import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAuth } from '../src/contexts/AuthContext';
import { Button } from '../src/components/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  const handleDownloadStatement = () => {
    Alert.alert('Download Statement', `Downloading ${selectedPeriod}ly statement...`);
  };

  const personalInfo = [
    { label: 'Full Name', value: `${user?.firstName} ${user?.lastName}`, icon: 'person' },
    { label: 'Email', value: user?.email, icon: 'mail' },
    { label: 'Phone', value: user?.phone, icon: 'call' },
    { label: 'KYC Level', value: `Level ${user?.kycLevel || 1}`, icon: 'shield-checkmark' },
    { label: 'Member Since', value: 'January 2024', icon: 'calendar' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.surface }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.surface }]} onPress={() => router.push('/edit-profile')}>
          <Ionicons name="create-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <LinearGradient
          colors={[colors.gradient1, colors.gradient2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </Text>
          </View>
          <Text style={styles.profileName}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          
          <View style={styles.kycBadge}>
            <Ionicons name="shield-checkmark" size={16} color={colors.surface} />
            <Text style={styles.kycText}>KYC Level {user?.kycLevel}</Text>
          </View>
        </LinearGradient>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PERSONAL INFORMATION</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            {personalInfo.map((item, index) => (
              <View key={index}>
                <View style={styles.infoRow}>
                  <View style={styles.infoLeft}>
                    <View style={[styles.infoIcon, { backgroundColor: colors.primary + '20' }]}>
                      <Ionicons name={item.icon as any} size={18} color={colors.primary} />
                    </View>
                    <View style={styles.infoText}>
                      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>{item.value}</Text>
                    </View>
                  </View>
                </View>
                {index < personalInfo.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Bank Statements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>BANK STATEMENTS</Text>
          
          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {['month', 'quarter', 'year'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  { backgroundColor: selectedPeriod === period ? colors.primary : colors.surface },
                ]}
                onPress={() => setSelectedPeriod(period as any)}
              >
                <Text
                  style={[
                    styles.periodText,
                    { color: selectedPeriod === period ? colors.surface : colors.text },
                  ]}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.statementRow}>
              <View style={styles.statementLeft}>
                <Ionicons name="document-text" size={24} color={colors.primary} />
                <View style={styles.statementInfo}>
                  <Text style={[styles.statementTitle, { color: colors.text }]}>
                    {selectedPeriod === 'month' && 'January 2024'}
                    {selectedPeriod === 'quarter' && 'Q4 2023'}
                    {selectedPeriod === 'year' && 'Year 2023'}
                  </Text>
                  <Text style={[styles.statementSubtitle, { color: colors.textSecondary }]}>
                    23 transactions
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.downloadButton, { backgroundColor: colors.primary + '20' }]}
                onPress={handleDownloadStatement}
              >
                <Ionicons name="download-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title="Download All Statements"
            onPress={() => Alert.alert('Download', 'Downloading all statements...')}
            variant="outline"
            style={styles.downloadAllButton}
          />
        </View>

        {/* Connected Accounts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CONNECTED ACCOUNTS</Text>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/linked-accounts')}
          >
            <View style={styles.connectedRow}>
              <View style={styles.connectedLeft}>
                <View style={[styles.connectedIcon, { backgroundColor: '#FFCC00' + '20' }]}>
                  <Ionicons name="phone-portrait" size={22} color="#FFCC00" />
                </View>
                <View>
                  <Text style={[styles.connectedTitle, { color: colors.text }]}>Mobile Money</Text>
                  <Text style={[styles.connectedSubtitle, { color: colors.textSecondary }]}>
                    2 accounts linked
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACCOUNT ACTIONS</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <TouchableOpacity style={styles.actionRow}>
              <View style={styles.actionLeft}>
                <Ionicons name="document-text-outline" size={22} color={colors.text} />
                <Text style={[styles.actionText, { color: colors.text }]}>Export All Data</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.actionRow}>
              <View style={styles.actionLeft}>
                <Ionicons name="shield-outline" size={22} color={colors.text} />
                <Text style={[styles.actionText, { color: colors.text }]}>Upgrade KYC</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.actionRow}>
              <View style={styles.actionLeft}>
                <Ionicons name="trash-outline" size={22} color={colors.error} />
                <Text style={[styles.actionText, { color: colors.error }]}>Delete Account</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
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
    paddingBottom: 40,
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  kycText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  card: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  statementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statementInfo: {
    marginLeft: 16,
  },
  statementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statementSubtitle: {
    fontSize: 13,
  },
  downloadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadAllButton: {
    marginHorizontal: 20,
    marginTop: 12,
  },
  connectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  connectedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectedIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  connectedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  connectedSubtitle: {
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
