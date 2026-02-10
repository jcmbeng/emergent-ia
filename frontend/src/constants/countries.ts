// Countries with IBAN support
export interface Country {
  code: string;
  name: string;
  ibanPrefix: string;
  ibanLength: number;
  flag: string;
}

export const countries: Country[] = [
  // African Countries (CEMAC Zone - XAF)
  { code: 'CM', name: 'Cameroon', ibanPrefix: 'CM', ibanLength: 27, flag: '🇨🇲' },
  { code: 'CF', name: 'Central African Republic', ibanPrefix: 'CF', ibanLength: 27, flag: '🇨🇫' },
  { code: 'TD', name: 'Chad', ibanPrefix: 'TD', ibanLength: 27, flag: '🇹🇩' },
  { code: 'CG', name: 'Congo', ibanPrefix: 'CG', ibanLength: 27, flag: '🇨🇬' },
  { code: 'GQ', name: 'Equatorial Guinea', ibanPrefix: 'GQ', ibanLength: 27, flag: '🇬🇶' },
  { code: 'GA', name: 'Gabon', ibanPrefix: 'GA', ibanLength: 27, flag: '🇬🇦' },
  // African Countries (UEMOA Zone - XOF)
  { code: 'BJ', name: 'Benin', ibanPrefix: 'BJ', ibanLength: 28, flag: '🇧🇯' },
  { code: 'BF', name: 'Burkina Faso', ibanPrefix: 'BF', ibanLength: 28, flag: '🇧🇫' },
  { code: 'CI', name: "Côte d'Ivoire", ibanPrefix: 'CI', ibanLength: 28, flag: '🇨🇮' },
  { code: 'GW', name: 'Guinea-Bissau', ibanPrefix: 'GW', ibanLength: 25, flag: '🇬🇼' },
  { code: 'ML', name: 'Mali', ibanPrefix: 'ML', ibanLength: 28, flag: '🇲🇱' },
  { code: 'NE', name: 'Niger', ibanPrefix: 'NE', ibanLength: 28, flag: '🇳🇪' },
  { code: 'SN', name: 'Senegal', ibanPrefix: 'SN', ibanLength: 28, flag: '🇸🇳' },
  { code: 'TG', name: 'Togo', ibanPrefix: 'TG', ibanLength: 28, flag: '🇹🇬' },
  // European Countries
  { code: 'FR', name: 'France', ibanPrefix: 'FR', ibanLength: 27, flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', ibanPrefix: 'DE', ibanLength: 22, flag: '🇩🇪' },
  { code: 'ES', name: 'Spain', ibanPrefix: 'ES', ibanLength: 24, flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', ibanPrefix: 'IT', ibanLength: 27, flag: '🇮🇹' },
  { code: 'GB', name: 'United Kingdom', ibanPrefix: 'GB', ibanLength: 22, flag: '🇬🇧' },
  { code: 'CH', name: 'Switzerland', ibanPrefix: 'CH', ibanLength: 21, flag: '🇨🇭' },
  { code: 'BE', name: 'Belgium', ibanPrefix: 'BE', ibanLength: 16, flag: '🇧🇪' },
  { code: 'NL', name: 'Netherlands', ibanPrefix: 'NL', ibanLength: 18, flag: '🇳🇱' },
  { code: 'AT', name: 'Austria', ibanPrefix: 'AT', ibanLength: 20, flag: '🇦🇹' },
  { code: 'PT', name: 'Portugal', ibanPrefix: 'PT', ibanLength: 25, flag: '🇵🇹' },
  { code: 'GR', name: 'Greece', ibanPrefix: 'GR', ibanLength: 27, flag: '🇬🇷' },
  { code: 'IE', name: 'Ireland', ibanPrefix: 'IE', ibanLength: 22, flag: '🇮🇪' },
  { code: 'LU', name: 'Luxembourg', ibanPrefix: 'LU', ibanLength: 20, flag: '🇱🇺' },
  { code: 'PL', name: 'Poland', ibanPrefix: 'PL', ibanLength: 28, flag: '🇵🇱' },
  { code: 'SE', name: 'Sweden', ibanPrefix: 'SE', ibanLength: 24, flag: '🇸🇪' },
  { code: 'DK', name: 'Denmark', ibanPrefix: 'DK', ibanLength: 18, flag: '🇩🇰' },
  { code: 'NO', name: 'Norway', ibanPrefix: 'NO', ibanLength: 15, flag: '🇳🇴' },
  { code: 'FI', name: 'Finland', ibanPrefix: 'FI', ibanLength: 18, flag: '🇫🇮' },
];

// Get IBAN placeholder for a country
export const getIbanPlaceholder = (countryCode: string): string => {
  const country = countries.find(c => c.code === countryCode);
  if (!country) return 'XX00 0000 0000 0000 0000 00';
  
  const remaining = country.ibanLength - 2; // Minus prefix
  const parts = [];
  for (let i = 0; i < remaining; i += 4) {
    parts.push('0'.repeat(Math.min(4, remaining - i)));
  }
  return `${country.ibanPrefix}00 ${parts.join(' ')}`;
};

// Format IBAN with spaces
export const formatIban = (iban: string): string => {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

// Validate IBAN length for a country
export const validateIbanLength = (iban: string, countryCode: string): boolean => {
  const country = countries.find(c => c.code === countryCode);
  if (!country) return false;
  const cleaned = iban.replace(/\s/g, '');
  return cleaned.length === country.ibanLength;
};