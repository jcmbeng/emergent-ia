import axios, { AxiosInstance, AxiosError } from 'axios';
import { secureStorage } from '../utils/storage';
import Constants from 'expo-constants';
import {
  mockUser,
  mockWallets,
  mockTransactions,
  mockBeneficiaries,
  delay,
  generateId,
} from './mockData';
import { banksByCountry, Bank } from '../constants/banks';
import { countries, Country } from '../constants/countries';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || 'https://api.finance.ethic-meida.com';

// Set to true to use mock data, false to use real API
const USE_MOCK = true;

class ApiService {
  private api: AxiosInstance;
  private mockTransactions = [...mockTransactions];
  private mockBeneficiariesList = [...mockBeneficiaries];

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await secureStorage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, logout user
          await secureStorage.removeToken();
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: any) {
    if (USE_MOCK) {
      await delay();
      const token = 'mock_jwt_token_' + generateId();
      return {
        data: {
          success: true,
          data: {
            token,
            user: { ...mockUser, email: data.email, firstName: data.firstName, lastName: data.lastName },
          },
        },
      };
    }
    return this.api.post('/auth/register', data);
  }

  async login(email: string, password: string) {
    if (USE_MOCK) {
      await delay();
      const token = 'mock_jwt_token_' + generateId();
      return {
        data: {
          success: true,
          data: {
            token,
            user: mockUser,
          },
        },
      };
    }
    return this.api.post('/auth/login', { email, password });
  }

  async setupPin(pin: string) {
    if (USE_MOCK) {
      await delay();
      return { data: { success: true, data: {} } };
    }
    return this.api.post('/auth/setup-pin', { pin });
  }

  async verifyPin(pin: string) {
    if (USE_MOCK) {
      await delay(300);
      // Accept any 6-digit pin
      return { data: { success: pin.length === 6, data: {} } };
    }
    return this.api.post('/auth/verify-pin', { pin });
  }

  async sendMfaOtp() {
    if (USE_MOCK) {
      await delay();
      console.log('Mock OTP sent: 123456');
      return { data: { success: true, data: { message: 'OTP sent to email' } } };
    }
    return this.api.post('/auth/mfa/send-otp');
  }

  async verifyMfaOtp(otp: string) {
    if (USE_MOCK) {
      await delay();
      // Accept any OTP for demo
      return { data: { success: true, data: {} } };
    }
    return this.api.post('/auth/mfa/verify', { otp });
  }

  // Wallet endpoints
  async getWalletBalance() {
    if (USE_MOCK) {
      await delay();
      return {
        data: {
          success: true,
          data: {
            user: mockUser,
            wallet: mockWallets[0],
          },
        },
      };
    }
    return this.api.get('/wallet/balance');
  }

  async getWalletAccounts() {
    if (USE_MOCK) {
      await delay();
      return {
        data: {
          success: true,
          data: mockWallets[0], // Return primary wallet
        },
      };
    }
    return this.api.get('/wallet/accounts');
  }

  // Transaction endpoints
  async sendMoney(data: any) {
    if (USE_MOCK) {
      await delay(1000);
      const newTransaction = {
        id: generateId(),
        type: 'send' as const,
        amount: data.amount,
        currency: data.currency,
        recipientEmail: data.recipientEmail,
        recipientName: data.recipientName,
        status: 'completed' as const,
        method: 'wire',
        fee: data.amount * 0.01,
        description: data.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.mockTransactions.unshift(newTransaction);
      
      // Update wallet balance
      mockWallets[0].balance -= (data.amount + newTransaction.fee);
      
      return {
        data: {
          success: true,
          data: newTransaction,
        },
      };
    }
    return this.api.post('/transactions/send', data);
  }

  async getTransactions(params?: any) {
    if (USE_MOCK) {
      await delay();
      let filteredTransactions = [...this.mockTransactions];
      
      if (params?.type) {
        filteredTransactions = filteredTransactions.filter(t => t.type === params.type);
      }
      
      return {
        data: {
          success: true,
          data: {
            transactions: filteredTransactions,
            total: filteredTransactions.length,
          },
        },
      };
    }
    return this.api.get('/transactions', { params });
  }

  async getTransaction(id: string) {
    if (USE_MOCK) {
      await delay();
      const transaction = this.mockTransactions.find(t => t.id === id);
      return {
        data: {
          success: true,
          data: transaction,
        },
      };
    }
    return this.api.get(`/transactions/${id}`);
  }

  async getTransactionReceipt(id: string) {
    if (USE_MOCK) {
      await delay();
      return {
        data: {
          success: true,
          data: { url: 'mock_receipt_url' },
        },
      };
    }
    return this.api.get(`/transactions/${id}/receipt`, { responseType: 'blob' });
  }

  async exportTransactions(format: 'pdf' | 'csv') {
    if (USE_MOCK) {
      await delay(1500);
      return {
        data: {
          success: true,
          data: { url: `mock_export_${format}` },
        },
      };
    }
    return this.api.post('/transactions/export', { format }, { responseType: 'blob' });
  }

  // Mobile Money endpoints
  async mtnDeposit(amount: number, phone: string) {
    if (USE_MOCK) {
      await delay(1500);
      const newTransaction = {
        id: generateId(),
        type: 'deposit' as const,
        amount,
        currency: 'USD',
        status: 'completed' as const,
        method: 'momo_mtn',
        fee: amount * 0.01,
        description: `MTN MoMo deposit from ${phone}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.mockTransactions.unshift(newTransaction);
      
      // Update wallet balance
      mockWallets[0].balance += (amount - newTransaction.fee);
      
      return {
        data: {
          success: true,
          data: newTransaction,
        },
      };
    }
    return this.api.post('/mobile-money/mtn/deposit', { amount, phone });
  }

  async mtnWithdraw(amount: number, phone: string) {
    if (USE_MOCK) {
      await delay(1500);
      const newTransaction = {
        id: generateId(),
        type: 'withdraw' as const,
        amount,
        currency: 'USD',
        status: 'completed' as const,
        method: 'momo_mtn',
        fee: amount * 0.025,
        description: `MTN MoMo withdrawal to ${phone}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.mockTransactions.unshift(newTransaction);
      
      // Update wallet balance
      mockWallets[0].balance -= (amount + newTransaction.fee);
      
      return {
        data: {
          success: true,
          data: newTransaction,
        },
      };
    }
    return this.api.post('/mobile-money/mtn/withdraw', { amount, phone });
  }

  async orangeDeposit(amount: number, phone: string) {
    if (USE_MOCK) {
      await delay(1500);
      const newTransaction = {
        id: generateId(),
        type: 'deposit' as const,
        amount,
        currency: 'USD',
        status: 'completed' as const,
        method: 'momo_orange',
        fee: amount * 0.01,
        description: `Orange Money deposit from ${phone}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.mockTransactions.unshift(newTransaction);
      
      // Update wallet balance
      mockWallets[0].balance += (amount - newTransaction.fee);
      
      return {
        data: {
          success: true,
          data: newTransaction,
        },
      };
    }
    return this.api.post('/mobile-money/orange/deposit', { amount, phone });
  }

  async orangeWithdraw(amount: number, phone: string) {
    if (USE_MOCK) {
      await delay(1500);
      const newTransaction = {
        id: generateId(),
        type: 'withdraw' as const,
        amount,
        currency: 'USD',
        status: 'completed' as const,
        method: 'momo_orange',
        fee: amount * 0.025,
        description: `Orange Money withdrawal to ${phone}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.mockTransactions.unshift(newTransaction);
      
      // Update wallet balance
      mockWallets[0].balance -= (amount + newTransaction.fee);
      
      return {
        data: {
          success: true,
          data: newTransaction,
        },
      };
    }
    return this.api.post('/mobile-money/orange/withdraw', { amount, phone });
  }

  // Beneficiaries
  async getBeneficiaries() {
    if (USE_MOCK) {
      await delay();
      return {
        data: {
          success: true,
          data: this.mockBeneficiariesList,
        },
      };
    }
    return this.api.get('/beneficiaries');
  }

  async addBeneficiary(data: any) {
    if (USE_MOCK) {
      await delay();
      const newBeneficiary = {
        id: generateId(),
        userId: '1',
        ...data,
        createdAt: new Date().toISOString(),
      };
      this.mockBeneficiariesList.push(newBeneficiary);
      return {
        data: {
          success: true,
          data: newBeneficiary,
        },
      };
    }
    return this.api.post('/beneficiaries', data);
  }

  async deleteBeneficiary(id: string) {
    if (USE_MOCK) {
      await delay();
      this.mockBeneficiariesList = this.mockBeneficiariesList.filter(b => b.id !== id);
      return {
        data: {
          success: true,
          data: {},
        },
      };
    }
    return this.api.delete(`/beneficiaries/${id}`);
  }

  // QR Code
  async generateQrPayment(amount: number, currency: string) {
    if (USE_MOCK) {
      await delay();
      return {
        data: {
          success: true,
          data: {
            qrCode: 'mock_qr_code_data',
            paymentId: generateId(),
          },
        },
      };
    }
    return this.api.post('/qr/generate', { amount, currency });
  }

  async processQrPayment(qrData: string) {
    if (USE_MOCK) {
      await delay(1000);
      return {
        data: {
          success: true,
          data: { message: 'Payment processed successfully' },
        },
      };
    }
    return this.api.post('/qr/scan', { qrData });
  }

  // KYC
  async getKycStatus() {
    if (USE_MOCK) {
      await delay();
      return {
        data: {
          success: true,
          data: {
            level: mockUser.kycLevel,
            limits: {
              daily: 5000,
              monthly: 50000,
            },
          },
        },
      };
    }
    return this.api.get('/kyc/status');
  }

  async upgradeKyc(level: number, documents: any) {
    if (USE_MOCK) {
      await delay(2000);
      return {
        data: {
          success: true,
          data: { message: 'KYC upgrade submitted for review' },
        },
      };
    }
    return this.api.post('/kyc/upgrade', { level, documents });
  }
}

export const apiService = new ApiService();