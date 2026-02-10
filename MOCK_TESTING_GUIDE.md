# 🎭 Mock Mode Testing Guide

## 🎉 App is Now Fully Mocked!

The mobile e-Wallet app is now running with **complete mock data** so you can navigate and test all features without needing the backend!

---

## 🚀 How to Access the App

### **Web Preview (Easiest)**
**URL:** https://ewallet-finance.preview.emergentagent.com

### **Mobile (Recommended for Best Experience)**
1. Download **Expo Go** app from App Store or Play Store
2. Scan the QR code from the Metro bundler
3. App will load on your phone

---

## 🔐 Test Credentials

You can use **ANY** email/password to login or register:

### Quick Login
- **Email:** Any email (e.g., `test@example.com`)
- **Password:** Any password (e.g., `password123`)
- **PIN:** Any 6-digit number (e.g., `123456`)

The app will accept any credentials in mock mode!

---

## 📱 Complete User Journey

### **1. Registration Flow**
1. Open app → Tap **"Sign Up"**
2. Fill in any details:
   - First Name: John
   - Last Name: Doe
   - Email: john@test.com
   - Phone: +237123456789
   - Password: password123
3. Tap **"Create Account"**
4. **Set PIN:** Enter any 6 digits (e.g., 123456)
5. Confirm PIN by re-entering
6. **Enable Biometric** (optional - tap Skip)
7. You're in! 🎉

### **2. Login Flow**
1. Open app → Enter credentials
2. Tap **"Sign In"**
3. **Enter PIN:** Any 6 digits
4. Dashboard appears

---

## 💰 Mock Data Available

### **User Profile**
- Name: John Doe
- Email: john.doe@example.com
- Phone: +237123456789
- KYC Level: 2

### **Wallet Balance**
- **USD:** $2,450.75
- **XAF:** 1,250,000 XAF
- **EUR:** €890.50

### **8 Sample Transactions**
- 2 Received payments
- 3 Sent payments
- 2 Mobile Money deposits
- 1 Mobile Money withdrawal
- Mix of completed and pending statuses

### **4 Beneficiaries**
- Alice Smith (alice@example.com)
- Bob Johnson (bob@example.com)
- Sarah Williams (sarah@example.com)
- Emma Brown (emma@example.com)

---

## 🎯 Features to Test

### ✅ **Home Dashboard**
- View wallet balance ($2,450.75)
- See recent transactions (last 5)
- Quick actions: Send, Deposit, QR Pay
- Pull to refresh

### ✅ **Send Money**
**Test Flow:**
1. Tap **"Send"** on home screen
2. Select a beneficiary OR enter email manually
3. Enter amount (e.g., 100)
4. Add description (optional)
5. Tap **"Send Money"**
6. Confirm in dialog
7. Watch balance update in real-time!

**What Happens:**
- New transaction appears at top
- Balance decreases by (amount + 1% fee)
- Success message shown

### ✅ **Transactions**
**Test Flow:**
1. Navigate to **"Transactions"** tab
2. View all 8+ transactions
3. Filter by type: All, Send, Receive, Deposit, Withdraw
4. Tap any transaction to view details
5. Pull to refresh

### ✅ **Mobile Money**
**Test MTN MoMo:**
1. Home → Tap **"Mobile Money"** quick action
2. Select **"MTN MoMo"**
3. Choose **"Deposit"** or **"Withdraw"**
4. Enter phone: +237123456789
5. Enter amount: 500
6. Tap **"Deposit/Withdraw Funds"**
7. Wait for confirmation
8. Check updated balance & new transaction!

**Test Orange Money:**
- Same flow as MTN
- Select **"Orange Money"** provider

### ✅ **Beneficiaries**
**Add New:**
1. More → **"Beneficiaries"**
2. Tap **"+"** icon
3. Fill in details:
   - Name: Test User
   - Email: test@example.com
   - Phone: +237111222333
4. Tap **"Add Beneficiary"**
5. New beneficiary appears!

**Delete:**
1. Tap trash icon on any beneficiary
2. Confirm deletion
3. Beneficiary removed

### ✅ **Profile & More**
Navigate to **"More"** tab to see:
- User profile card
- KYC Level indicator
- Menu items for all features
- Logout option

---

## 🎨 UI Features to Notice

### **Beautiful Design**
- ✨ Modern Indigo color scheme
- 🎯 Smooth animations and transitions
- 📱 Native mobile feel
- 🎭 Professional status badges
- 💎 Rounded corners and shadows

### **Smart UX**
- ⚡ Pull-to-refresh on lists
- 🔄 Loading states with spinners
- ✅ Success/error alerts
- 📊 Transaction status colors
- 👤 Avatar initials for beneficiaries

### **Real-Time Updates**
- Balance updates immediately after transactions
- New transactions appear at top of list
- Beneficiary list updates live

---

## 🧪 Test Scenarios

### **Scenario 1: First Time User**
```
1. Register with new credentials
2. Setup PIN
3. Skip biometric
4. Explore dashboard
5. Send first payment
6. Add beneficiary
7. Check transactions
```

### **Scenario 2: Send Money to Beneficiary**
```
1. Login
2. Navigate to Send
3. Select Alice Smith from beneficiaries
4. Enter $50
5. Send
6. Verify in Transactions tab
7. Check updated balance
```

### **Scenario 3: Mobile Money Deposit**
```
1. Home → Mobile Money
2. Select MTN MoMo
3. Choose Deposit
4. Enter phone & amount ($200)
5. Submit
6. Watch balance increase
7. Find transaction in history
```

### **Scenario 4: Filter Transactions**
```
1. Transactions tab
2. Tap "Send" filter
3. See only sent transactions
4. Tap "Deposit" filter
5. See only deposits
6. Tap "All" to reset
```

---

## 💡 Pro Tips

### **1. Reset Data**
- Restart app to reset to initial mock data
- Balance resets to $2,450.75
- Original 8 transactions restored

### **2. Test Real-Time**
- Send money and immediately check balance
- Transaction appears instantly at top
- Pull-to-refresh to see updates

### **3. Explore All Screens**
- Use bottom tab navigation
- Tap "More" to access all features
- Try different transaction filters

### **4. Test Forms**
- All fields have validation
- Try submitting empty forms
- See error messages
- Test with invalid emails

---

## 📊 What's Working

✅ **Complete Authentication**
- Login, Register, PIN, Biometric

✅ **Full Navigation**
- Tab navigation smooth
- Screen transitions working
- Back button functional

✅ **All CRUD Operations**
- Create transactions
- Read wallet & transactions
- Update beneficiaries
- Delete beneficiaries

✅ **Real-Time State**
- Balance updates live
- Transaction list dynamic
- Beneficiary list reactive

✅ **Form Validation**
- Email validation
- Amount validation
- Required field checks
- Balance sufficiency checks

---

## 🎯 Testing Checklist

Use this checklist to test all features:

### Authentication
- [ ] Register new user
- [ ] Login with credentials
- [ ] Setup 6-digit PIN
- [ ] Skip biometric setup
- [ ] Logout

### Wallet & Dashboard
- [ ] View balance on home
- [ ] See recent transactions
- [ ] Pull to refresh
- [ ] Tap quick action buttons

### Transactions
- [ ] View transaction list
- [ ] Filter by type
- [ ] Tap transaction for details
- [ ] Pull to refresh

### Send Money
- [ ] Select beneficiary
- [ ] Enter amount manually
- [ ] Add description
- [ ] Confirm transaction
- [ ] Verify balance update

### Mobile Money
- [ ] Select MTN provider
- [ ] Choose deposit
- [ ] Enter phone & amount
- [ ] Submit transaction
- [ ] Select Orange provider
- [ ] Choose withdraw
- [ ] Complete transaction

### Beneficiaries
- [ ] View beneficiary list
- [ ] Add new beneficiary
- [ ] Select for quick transfer
- [ ] Delete beneficiary

### Profile & Settings
- [ ] View profile card
- [ ] Check KYC level
- [ ] Navigate menu items
- [ ] Logout successfully

---

## 🚀 Next Steps

After testing the mock app:

1. **Switch to Real Backend**
   - Open `/app/frontend/src/services/api.ts`
   - Change `USE_MOCK = true` to `USE_MOCK = false`
   - Restart app
   - Now connects to your Spring Boot backend!

2. **Deploy to App Stores**
   - Build iOS app: `eas build --platform ios`
   - Build Android app: `eas build --platform android`
   - Submit to App Store & Play Store

3. **Add Phase 2 Features**
   - QR code scanning
   - PDF receipts
   - Transaction export
   - Push notifications

---

## 🎉 Enjoy Testing!

The app is **fully functional** with mock data. You can:
- Navigate all screens ✅
- Send money ✅
- Deposit/Withdraw via Mobile Money ✅
- Manage beneficiaries ✅
- View transactions ✅
- Experience the complete user flow ✅

**Have fun exploring your mobile e-Wallet! 🚀**
