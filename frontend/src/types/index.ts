export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  kycLevel: number;
  mfaEnabled: boolean;
  biometricEnabled: boolean;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: number;
  status: string;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'deposit' | 'withdraw';
  amount: number;
  currency: string;
  recipientEmail?: string;
  recipientName?: string;
  senderEmail?: string;
  senderName?: string;
  status: 'pending' | 'completed' | 'failed';
  method: string;
  fee: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Beneficiary {
  id: string;
  userId: string;
  beneficiaryName: string;
  beneficiaryEmail: string;
  beneficiaryPhone: string;
  nickname: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}