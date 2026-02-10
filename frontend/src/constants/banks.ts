// Banks organized by country
export interface Bank {
  id: string;
  name: string;
  code: string;
  country: string;
  swiftCode?: string;
}

// Mock banks data - in real app, this would come from backend API
export const banksByCountry: Record<string, Bank[]> = {
  // Cameroon
  CM: [
    { id: 'cm_1', name: 'Afriland First Bank', code: 'AFB', country: 'CM', swiftCode: 'AFRI' },
    { id: 'cm_2', name: 'Société Générale Cameroun', code: 'SGC', country: 'CM', swiftCode: 'SGCM' },
    { id: 'cm_3', name: 'Ecobank Cameroun', code: 'ECO', country: 'CM', swiftCode: 'ECOCCMCX' },
    { id: 'cm_4', name: 'BICEC', code: 'BIC', country: 'CM', swiftCode: 'BICECMCX' },
    { id: 'cm_5', name: 'UBA Cameroun', code: 'UBA', country: 'CM', swiftCode: 'UNAFCMCX' },
    { id: 'cm_6', name: 'National Financial Credit Bank', code: 'NFC', country: 'CM', swiftCode: 'NFCBCMCX' },
    { id: 'cm_7', name: 'Commercial Bank of Cameroon', code: 'CBC', country: 'CM', swiftCode: 'CBCOCMCX' },
    { id: 'cm_8', name: 'BGFI Bank Cameroun', code: 'BGFI', country: 'CM', swiftCode: 'BGFICMCX' },
  ],
  // Central African Republic
  CF: [
    { id: 'cf_1', name: 'BSIC Centrafrique', code: 'BSIC', country: 'CF' },
    { id: 'cf_2', name: 'Ecobank Centrafrique', code: 'ECO', country: 'CF' },
  ],
  // Gabon
  GA: [
    { id: 'ga_1', name: 'BGFI Bank Gabon', code: 'BGFI', country: 'GA', swiftCode: 'BGFIGACX' },
    { id: 'ga_2', name: 'UGB Gabon', code: 'UGB', country: 'GA' },
    { id: 'ga_3', name: 'Orabank Gabon', code: 'ORA', country: 'GA' },
  ],
  // Congo
  CG: [
    { id: 'cg_1', name: 'BGFI Bank Congo', code: 'BGFI', country: 'CG' },
    { id: 'cg_2', name: 'Ecobank Congo', code: 'ECO', country: 'CG' },
    { id: 'cg_3', name: 'UBA Congo', code: 'UBA', country: 'CG' },
  ],
  // Senegal
  SN: [
    { id: 'sn_1', name: 'CBAO Groupe Attijariwafa', code: 'CBAO', country: 'SN', swiftCode: 'CBAOSNDX' },
    { id: 'sn_2', name: 'Société Générale Sénégal', code: 'SGS', country: 'SN', swiftCode: 'SGSNSNDA' },
    { id: 'sn_3', name: 'Ecobank Sénégal', code: 'ECO', country: 'SN' },
    { id: 'sn_4', name: 'Bank of Africa Sénégal', code: 'BOA', country: 'SN' },
  ],
  // Côte d'Ivoire
  CI: [
    { id: 'ci_1', name: 'SGBCI', code: 'SGBCI', country: 'CI', swiftCode: 'SGBCCIAB' },
    { id: 'ci_2', name: 'Ecobank Côte d\'Ivoire', code: 'ECO', country: 'CI' },
    { id: 'ci_3', name: 'BICICI', code: 'BICICI', country: 'CI' },
    { id: 'ci_4', name: 'UBA Côte d\'Ivoire', code: 'UBA', country: 'CI' },
    { id: 'ci_5', name: 'Bank of Africa CI', code: 'BOA', country: 'CI' },
  ],
  // France
  FR: [
    { id: 'fr_1', name: 'BNP Paribas', code: 'BNP', country: 'FR', swiftCode: 'BNPAFRPP' },
    { id: 'fr_2', name: 'Société Générale', code: 'SG', country: 'FR', swiftCode: 'SOGEFRPP' },
    { id: 'fr_3', name: 'Crédit Agricole', code: 'CA', country: 'FR', swiftCode: 'AGRIFRPP' },
    { id: 'fr_4', name: 'Crédit Mutuel', code: 'CM', country: 'FR', swiftCode: 'CMCIFRPP' },
    { id: 'fr_5', name: 'LCL', code: 'LCL', country: 'FR', swiftCode: 'CRLYFRPP' },
    { id: 'fr_6', name: 'La Banque Postale', code: 'LBP', country: 'FR', swiftCode: 'PSSTFRPP' },
    { id: 'fr_7', name: 'HSBC France', code: 'HSBC', country: 'FR', swiftCode: 'CCFRFRPP' },
  ],
  // Germany
  DE: [
    { id: 'de_1', name: 'Deutsche Bank', code: 'DB', country: 'DE', swiftCode: 'DEUTDEFF' },
    { id: 'de_2', name: 'Commerzbank', code: 'COBA', country: 'DE', swiftCode: 'COBADEFF' },
    { id: 'de_3', name: 'DZ Bank', code: 'DZ', country: 'DE', swiftCode: 'GENODEFF' },
    { id: 'de_4', name: 'KfW', code: 'KFW', country: 'DE', swiftCode: 'KFWIDEFF' },
    { id: 'de_5', name: 'N26 Bank', code: 'N26', country: 'DE', swiftCode: 'NTSBDEB1' },
  ],
  // United Kingdom
  GB: [
    { id: 'gb_1', name: 'HSBC UK', code: 'HSBC', country: 'GB', swiftCode: 'HBUKGB4B' },
    { id: 'gb_2', name: 'Barclays', code: 'BARC', country: 'GB', swiftCode: 'BARCGB22' },
    { id: 'gb_3', name: 'Lloyds Bank', code: 'LLOYDS', country: 'GB', swiftCode: 'LOYDGB2L' },
    { id: 'gb_4', name: 'NatWest', code: 'NATWEST', country: 'GB', swiftCode: 'NWBKGB2L' },
    { id: 'gb_5', name: 'Santander UK', code: 'SAN', country: 'GB', swiftCode: 'ABBYGB2L' },
    { id: 'gb_6', name: 'Revolut', code: 'REV', country: 'GB', swiftCode: 'REVOGB21' },
  ],
  // Belgium
  BE: [
    { id: 'be_1', name: 'BNP Paribas Fortis', code: 'BNP', country: 'BE', swiftCode: 'GEBABEBB' },
    { id: 'be_2', name: 'KBC Bank', code: 'KBC', country: 'BE', swiftCode: 'KREDBEBB' },
    { id: 'be_3', name: 'ING Belgium', code: 'ING', country: 'BE', swiftCode: 'BBRUBEBB' },
    { id: 'be_4', name: 'Belfius', code: 'BELF', country: 'BE', swiftCode: 'GKCCBEBB' },
  ],
  // Switzerland
  CH: [
    { id: 'ch_1', name: 'UBS', code: 'UBS', country: 'CH', swiftCode: 'UBSWCHZH' },
    { id: 'ch_2', name: 'Credit Suisse', code: 'CS', country: 'CH', swiftCode: 'CRESCHZZ' },
    { id: 'ch_3', name: 'Pictet', code: 'PIC', country: 'CH', swiftCode: 'PICTCHGG' },
    { id: 'ch_4', name: 'Julius Baer', code: 'JB', country: 'CH', swiftCode: 'BAABORBA' },
  ],
  // Italy
  IT: [
    { id: 'it_1', name: 'UniCredit', code: 'UCR', country: 'IT', swiftCode: 'UNCRITMM' },
    { id: 'it_2', name: 'Intesa Sanpaolo', code: 'ISP', country: 'IT', swiftCode: 'BCITITM' },
    { id: 'it_3', name: 'Banco BPM', code: 'BPM', country: 'IT' },
  ],
  // Spain
  ES: [
    { id: 'es_1', name: 'Santander', code: 'SAN', country: 'ES', swiftCode: 'BSCHESMM' },
    { id: 'es_2', name: 'BBVA', code: 'BBVA', country: 'ES', swiftCode: 'BBVAESMM' },
    { id: 'es_3', name: 'CaixaBank', code: 'CAIXA', country: 'ES', swiftCode: 'CAIXESBB' },
    { id: 'es_4', name: 'Sabadell', code: 'SAB', country: 'ES' },
  ],
  // Netherlands
  NL: [
    { id: 'nl_1', name: 'ING Bank', code: 'ING', country: 'NL', swiftCode: 'INGBNL2A' },
    { id: 'nl_2', name: 'ABN AMRO', code: 'ABN', country: 'NL', swiftCode: 'ABNANL2A' },
    { id: 'nl_3', name: 'Rabobank', code: 'RABO', country: 'NL', swiftCode: 'RABONL2U' },
    { id: 'nl_4', name: 'Bunq', code: 'BUNQ', country: 'NL', swiftCode: 'BUNQNL2A' },
  ],
};

// Get banks for a specific country
export const getBanksForCountry = (countryCode: string): Bank[] => {
  return banksByCountry[countryCode] || [];
};

// Get all available banks
export const getAllBanks = (): Bank[] => {
  return Object.values(banksByCountry).flat();
};
