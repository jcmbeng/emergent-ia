import { create } from 'zustand';
import { Wallet, Transaction, Beneficiary } from '../types';

interface WalletState {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  transactions: Transaction[];
  beneficiaries: Beneficiary[];
  isLoading: boolean;
  setWallets: (wallets: Wallet[]) => void;
  setSelectedWallet: (wallet: Wallet | null) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setBeneficiaries: (beneficiaries: Beneficiary[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallets: [],
  selectedWallet: null,
  transactions: [],
  beneficiaries: [],
  isLoading: false,
  setWallets: (wallets) => set({ wallets }),
  setSelectedWallet: (wallet) => set({ selectedWallet: wallet }),
  setTransactions: (transactions) => set({ transactions }),
  setBeneficiaries: (beneficiaries) => set({ beneficiaries }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));