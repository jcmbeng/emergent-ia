# Mobile e-Wallet App - React Native (Expo)

## 📱 Project Overview

A comprehensive mobile e-Wallet application built with **React Native & Expo** that connects to your **Spring Boot backend** at `https://api.finance.ethic-meida.com`.

## ✅ Core Features Implemented

### 1. **Authentication System**
- **Login & Registration** - Email/password authentication
- **PIN Setup & Verification** - 6-digit PIN for transactions
- **Biometric Authentication** - Face ID / Fingerprint support
- **MFA (Multi-Factor Authentication)** - Email OTP verification
- **Secure Storage** - JWT tokens & PINs stored securely
- **Session Management** - Auto-logout on token expiry

### 2. **Wallet Management**
- **Multi-Currency Support** - USD, EUR, XAF, etc.
- **Real-Time Balance Display** - Live balance updates
- **Account Overview** - View all wallet accounts
- **Transaction History** - Paginated transaction list with filters

### 3. **Wire Transfers**
- **Send Money** - Transfer funds to recipients
- **Recipient Selection** - Quick select from beneficiaries
- **Transaction Confirmation** - PIN-protected confirmations
- **Status Tracking** - Real-time transaction status
- **Fee Preview** - View fees before confirmation

### 4. **Mobile Money Integration**
- **MTN MoMo** - Deposit & Withdraw
- **Orange Money** - Deposit & Withdraw
- **Provider Selection UI** - Easy toggle between providers
- **Mock Integration** - Simulated responses for MVP

### 5. **Transaction Management**
- **Transaction List** - All transactions with filters
- **Filters** - By type (send/receive/deposit/withdraw), status, date
- **Transaction Details** - Full transaction information
- **Search Functionality** - Find transactions quickly

### 6. **Beneficiaries**
- **Save Beneficiaries** - Store frequent recipients
- **Quick Transfer** - Send money with one tap
- **Manage Beneficiaries** - Add/delete beneficiaries

### 7. **Additional Features**
- **QR Code Payments** (Ready for implementation)
- **Transaction Receipts** (PDF download ready)
- **Transaction Export** (CSV/PDF export ready)
- **KYC Management** (Tier-based limits ready)
- **Push Notifications** (Infrastructure ready)

## 🏗️ Project Structure

```
/app/frontend/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Authentication flows
│   │   ├── login.tsx            # Login screen
│   │   ├── register.tsx         # Registration screen
│   │   ├── pin-setup.tsx        # PIN creation
│   │   ├── pin-verify.tsx       # PIN verification
│   │   └── biometric-setup.tsx  # Biometric setup
│   ├── (tabs)/                  # Main app tabs
│   │   ├── home.tsx            # Dashboard/wallet overview
│   │   ├── transactions.tsx    # Transaction history
│   │   ├── send.tsx            # Send money flow
│   │   └── more.tsx            # Settings & profile
│   ├── mobile-money.tsx        # Mobile money operations
│   ├── beneficiaries.tsx       # Beneficiary management
│   ├── _layout.tsx             # Root layout with providers
│   └── index.tsx               # Entry point
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── TransactionCard.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication state
│   ├── services/
│   │   └── api.ts             # API service (Axios)
│   ├── stores/
│   │   └── walletStore.ts     # Zustand state management
│   ├── utils/
│   │   └── storage.ts         # Secure storage utilities
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   └── constants/
│       └── colors.ts          # Color palette
└── app.json                    # Expo configuration

```

## 🔌 Backend Integration

### API Base URL
```
https://api.finance.ethic-meida.com
```

### Endpoints Used
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/setup-pin` - Setup PIN
- `POST /auth/verify-pin` - Verify PIN
- `POST /auth/mfa/send-otp` - Send MFA OTP
- `POST /auth/mfa/verify` - Verify MFA OTP
- `GET /wallet/balance` - Get wallet balance
- `GET /wallet/accounts` - Get all accounts
- `POST /transactions/send` - Send money
- `GET /transactions` - List transactions
- `GET /transactions/{id}` - Get transaction details
- `POST /mobile-money/mtn/deposit` - MTN deposit
- `POST /mobile-money/mtn/withdraw` - MTN withdraw
- `POST /mobile-money/orange/deposit` - Orange deposit
- `POST /mobile-money/orange/withdraw` - Orange withdraw
- `GET /beneficiaries` - List beneficiaries
- `POST /beneficiaries` - Add beneficiary
- `DELETE /beneficiaries/{id}` - Delete beneficiary

### Authentication
- JWT Bearer Token in Authorization header
- Token automatically added via Axios interceptor
- Auto-logout on 401 responses

## 🎨 Design System

### Colors
- **Primary**: `#6366F1` (Indigo)
- **Secondary**: `#10B981` (Green)
- **Background**: `#F9FAFB` (Light Gray)
- **Surface**: `#FFFFFF` (White)
- **Error**: `#EF4444` (Red)
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Amber)

### Typography
- **Titles**: 28-32px, Bold
- **Headings**: 20-24px, SemiBold
- **Body**: 14-16px, Regular
- **Captions**: 12-13px, Regular

### Spacing
- Uses 8pt grid system (8px, 16px, 24px, 32px)

## 📦 Key Dependencies

```json
{
  "expo": "^54.0.33",
  "expo-router": "~6.0.22",
  "expo-local-authentication": "17.0.8",
  "expo-secure-store": "15.0.8",
  "expo-camera": "17.0.10",
  "axios": "1.13.5",
  "zustand": "5.0.11",
  "react-hook-form": "7.71.1",
  "date-fns": "4.1.0",
  "@react-navigation/bottom-tabs": "^7.3.10",
  "@react-navigation/native": "^7.1.6"
}
```

## 🔐 Security Features

1. **Secure Storage**
   - JWT tokens stored in Expo SecureStore
   - PINs hashed before storage
   - Biometric data handled by device secure enclave

2. **API Security**
   - Bearer token authentication
   - Automatic token refresh (ready)
   - Request/response interceptors
   - HTTPS-only communication

3. **Transaction Security**
   - PIN verification before sensitive operations
   - Transaction limits based on KYC level
   - Confirmation dialogs for money transfers

## 🧪 Testing the App

### Option 1: Expo Go App (Recommended for Quick Testing)
1. Download **Expo Go** from App Store (iOS) or Play Store (Android)
2. Open the app and scan the QR code from Metro bundler
3. App will load on your physical device

### Option 2: iOS Simulator
```bash
cd /app/frontend
yarn ios
```

### Option 3: Android Emulator
```bash
cd /app/frontend
yarn android
```

### Option 4: Web Preview
```bash
cd /app/frontend
yarn web
```
Access at: `https://finpal-mvp.preview.emergentagent.com`

## 🔄 App Flow

### First-Time User Flow
1. **Welcome/Login Screen** → User taps "Sign Up"
2. **Registration** → Fill form (name, email, phone, password)
3. **PIN Setup** → Create 6-digit PIN
4. **Biometric Setup** → Enable Face ID/Fingerprint (optional)
5. **Home Dashboard** → View wallet & start using app

### Returning User Flow
1. **Login Screen** → Enter email & password
2. **PIN Verification** → Enter 6-digit PIN (or use biometric)
3. **MFA** → Enter OTP sent to email (if enabled)
4. **Home Dashboard** → Access wallet features

### Send Money Flow
1. **Home** → Tap "Send" button
2. **Send Screen** → Select beneficiary or enter email
3. **Enter Amount** → Input amount & description
4. **Confirm** → Review details & confirm
5. **PIN Verification** → Enter PIN to authorize
6. **Success** → View transaction receipt

## 📱 Navigation Structure

```
App
├── Auth Stack (Unauthenticated)
│   ├── Login
│   ├── Register
│   ├── PIN Setup
│   ├── PIN Verify
│   └── Biometric Setup
│
└── Tab Navigator (Authenticated)
    ├── Home (Dashboard)
    ├── Transactions (History)
    ├── Send (Transfer money)
    └── More (Profile & Settings)
        ├── Beneficiaries
        ├── Mobile Money
        ├── QR Payments
        ├── Export
        └── Settings
```

## 🚀 Running the App

### Start Development Server
```bash
cd /app/frontend
sudo supervisorctl restart expo
```

### Check App Status
```bash
sudo supervisorctl status expo
```

### View Logs
```bash
tail -f /var/log/supervisor/expo.out.log
tail -f /var/log/supervisor/expo.err.log
```

## 🎯 Next Steps (Phase 2 Features)

1. **QR Code Implementation**
   - Generate QR codes for receiving money
   - Scan QR codes to send money
   - Dynamic QR with amount embedded

2. **Receipt Generation**
   - PDF receipt generation
   - Email receipts automatically
   - Download receipts to device

3. **Transaction Export**
   - Export to CSV format
   - Export to PDF format
   - Date range selection

4. **KYC Enhancement**
   - Document upload for KYC
   - Tier-based transaction limits
   - KYC status tracking

5. **Push Notifications**
   - Transaction confirmations
   - Security alerts
   - Promotional messages

6. **Profile Management**
   - Edit profile information
   - Change password
   - Update phone/email

7. **Settings**
   - Enable/disable biometric
   - Change PIN
   - Language preferences
   - Theme selection (Light/Dark)

## 🐛 Known Limitations (MVP)

1. **Mobile Money** - Mock integration (no real API calls)
2. **QR Payments** - UI ready, scanning needs implementation
3. **Receipts** - Download functionality needs file system integration
4. **Export** - Backend integration pending

## 📝 Notes for Development

- All API responses expected in format: `{ success: boolean, data: any, message?: string }`
- JWT token returned as: `{ token: string, user: User }`
- User object includes: `id, email, firstName, lastName, phone, kycLevel, mfaEnabled, biometricEnabled`
- Transaction amounts are in cents (multiply by 100 before sending to API)
- All dates in ISO 8601 format

## 🤝 Integration with Your Backend

Your Spring Boot backend should:
1. Accept JWT Bearer tokens in Authorization header
2. Return responses in the format: `{ success: true, data: {...} }`
3. Handle CORS for mobile app access
4. Return proper HTTP status codes (200, 400, 401, 500)
5. Validate PIN on server-side for sensitive operations

## 📞 Support

For any issues or questions:
- Check console logs in Expo
- Review backend API logs
- Verify network connectivity
- Ensure backend is accessible from mobile device

---

**Built with ❤️ using React Native, Expo, and TypeScript**
