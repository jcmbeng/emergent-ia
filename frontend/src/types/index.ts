export interface Beneficiary {
  id: string;
  userId: string;
  beneficiaryName: string;
  beneficiaryEmail?: string;
  beneficiaryPhone?: string;
  accountType: 'bank' | 'ewallet' | 'momo_mtn' | 'momo_orange';
  accountNumber?: string;
  bankName?: string;
  iban?: string;
  country?: string;
  nickname: string;
  isValidated: boolean;
  createdAt: string;
}