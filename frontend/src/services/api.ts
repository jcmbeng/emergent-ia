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
    return this.api.post('/auth/register', data);
  }

  async login(email: string, password: string) {
    return this.api.post('/auth/login', { email, password });
  }

  async setupPin(pin: string) {
    return this.api.post('/auth/setup-pin', { pin });
  }

  async verifyPin(pin: string) {
    return this.api.post('/auth/verify-pin', { pin });
  }

  async sendMfaOtp() {
    return this.api.post('/auth/mfa/send-otp');
  }

  async verifyMfaOtp(otp: string) {
    return this.api.post('/auth/mfa/verify', { otp });
  }

  // Wallet endpoints
  async getWalletBalance() {
    return this.api.get('/wallet/balance');
  }

  async getWalletAccounts() {
    return this.api.get('/wallet/accounts');
  }

  // Transaction endpoints
  async sendMoney(data: any) {
    return this.api.post('/transactions/send', data);
  }

  async getTransactions(params?: any) {
    return this.api.get('/transactions', { params });
  }

  async getTransaction(id: string) {
    return this.api.get(`/transactions/${id}`);
  }

  async getTransactionReceipt(id: string) {
    return this.api.get(`/transactions/${id}/receipt`, { responseType: 'blob' });
  }

  async exportTransactions(format: 'pdf' | 'csv') {
    return this.api.post('/transactions/export', { format }, { responseType: 'blob' });
  }

  // Mobile Money endpoints
  async mtnDeposit(amount: number, phone: string) {
    return this.api.post('/mobile-money/mtn/deposit', { amount, phone });
  }

  async mtnWithdraw(amount: number, phone: string) {
    return this.api.post('/mobile-money/mtn/withdraw', { amount, phone });
  }

  async orangeDeposit(amount: number, phone: string) {
    return this.api.post('/mobile-money/orange/deposit', { amount, phone });
  }

  async orangeWithdraw(amount: number, phone: string) {
    return this.api.post('/mobile-money/orange/withdraw', { amount, phone });
  }

  // Beneficiaries
  async getBeneficiaries() {
    return this.api.get('/beneficiaries');
  }

  async addBeneficiary(data: any) {
    return this.api.post('/beneficiaries', data);
  }

  async deleteBeneficiary(id: string) {
    return this.api.delete(`/beneficiaries/${id}`);
  }

  // QR Code
  async generateQrPayment(amount: number, currency: string) {
    return this.api.post('/qr/generate', { amount, currency });
  }

  async processQrPayment(qrData: string) {
    return this.api.post('/qr/scan', { qrData });
  }

  // KYC
  async getKycStatus() {
    return this.api.get('/kyc/status');
  }

  async upgradeKyc(level: number, documents: any) {
    return this.api.post('/kyc/upgrade', { level, documents });
  }
}

export const apiService = new ApiService();