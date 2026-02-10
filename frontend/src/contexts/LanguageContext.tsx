import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'fr';

interface Translations {
  [key: string]: string;
}

const translations = {
  en: {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.done': 'Done',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    
    // Home
    'home.title': 'Home',
    'home.totalBalance': 'Total Balance',
    'home.send': 'Send',
    'home.bank': 'Bank',
    'home.add': 'Add',
    'home.qr': 'QR',
    'home.transactions': 'Transactions',
    'home.seeAll': 'See All',
    
    // Profile
    'profile.title': 'Profile',
    'profile.personalInfo': 'PERSONAL INFORMATION',
    'profile.bankStatements': 'BANK STATEMENTS',
    'profile.fullName': 'Full Name',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.kycLevel': 'KYC Level',
    'profile.editProfile': 'Edit Profile',
    'profile.downloadStatement': 'Download Statement',
    
    // Settings
    'settings.title': 'Settings',
    'settings.appearance': 'APPEARANCE',
    'settings.darkMode': 'Dark Mode',
    'settings.language': 'Language',
    'settings.currency': 'Currency',
    'settings.security': 'SECURITY',
    'settings.changePin': 'Change PIN',
    'settings.biometric': 'Biometric Login',
    
    // Send Money
    'send.title': 'Send Money',
    'send.selectType': 'Select Account Type',
    'send.bank': 'Bank Account',
    'send.ewallet': 'e-Wallet',
    'send.momo': 'Mobile Money',
    'send.amount': 'Amount',
    'send.description': 'Description',
    'send.sendButton': 'Send Money',
    
    // Beneficiaries
    'beneficiary.title': 'Beneficiaries',
    'beneficiary.add': 'Add Beneficiary',
    'beneficiary.validated': 'Validated',
    'beneficiary.pending': 'Pending',
  },
  fr: {
    // Common
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.done': 'Terminé',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.search': 'Rechercher',
    
    // Home
    'home.title': 'Accueil',
    'home.totalBalance': 'Solde Total',
    'home.send': 'Envoyer',
    'home.bank': 'Banque',
    'home.add': 'Ajouter',
    'home.qr': 'QR',
    'home.transactions': 'Transactions',
    'home.seeAll': 'Voir Tout',
    
    // Profile
    'profile.title': 'Profil',
    'profile.personalInfo': 'INFORMATIONS PERSONNELLES',
    'profile.bankStatements': 'RELEVÉS BANCAIRES',
    'profile.fullName': 'Nom Complet',
    'profile.email': 'Email',
    'profile.phone': 'Téléphone',
    'profile.kycLevel': 'Niveau KYC',
    'profile.editProfile': 'Modifier le Profil',
    'profile.downloadStatement': 'Télécharger le Relevé',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.appearance': 'APPARENCE',
    'settings.darkMode': 'Mode Sombre',
    'settings.language': 'Langue',
    'settings.currency': 'Devise',
    'settings.security': 'SÉCURITÉ',
    'settings.changePin': 'Changer le PIN',
    'settings.biometric': 'Connexion Biométrique',
    
    // Send Money
    'send.title': 'Envoyer de l\'Argent',
    'send.selectType': 'Sélectionner le Type de Compte',
    'send.bank': 'Compte Bancaire',
    'send.ewallet': 'Portefeuille Électronique',
    'send.momo': 'Mobile Money',
    'send.amount': 'Montant',
    'send.description': 'Description',
    'send.sendButton': 'Envoyer de l\'Argent',
    
    // Beneficiaries
    'beneficiary.title': 'Bénéficiaires',
    'beneficiary.add': 'Ajouter un Bénéficiaire',
    'beneficiary.validated': 'Validé',
    'beneficiary.pending': 'En Attente',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('app_language');
      if (savedLang === 'en' || savedLang === 'fr') {
        setLanguageState(savedLang);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('app_language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};