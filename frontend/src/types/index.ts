export interface Beneficiary {
  id: string;
  userId: string;
  beneficiaryName: string;
  beneficiaryEmail?: string;
  beneficiaryPhone?: string;
  accountType: 'bank' | 'ewallet' | 'momo_mtn' | 'momo_orange';
  accountNumber?: string;
  bankName?: string;
  bankId?: string;
  iban?: string;
  country?: string;
  countryName?: string;
  swiftCode?: string;
  nickname?: string;
  isValidated?: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  kycLevel: number;
  mfaEnabled?: boolean;
  biometricEnabled?: boolean;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: number;
  status: 'active' | 'inactive' | 'frozen';
  type?: 'current' | 'savings';
  name?: string;
  interestRate?: number;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'deposit' | 'withdraw';
  amount: number;
  currency: string;
  recipientName?: string;
  recipientEmail?: string;
  senderName?: string;
  senderEmail?: string;
  status: 'pending' | 'completed' | 'failed';
  method?: string;
  fee: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}