# 🚀 Sealit - SocialFi Platform with Stellar Blockchain Integration

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Stellar](https://img.shields.io/badge/Stellar-SDK-13.3.0-purple)](https://stellar.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.8.2-purple)](https://redux-toolkit.js.org/)
[![Styled Components](https://img.shields.io/badge/Styled%20Components-6.1.19-pink)](https://styled-components.com/)

## 📋 Overview

**Sealit** is a cutting-edge SocialFi platform that combines social media functionality with blockchain-based token-gated content. Built on the Stellar network, it enables users to create posts that require token ownership for access, fostering a new paradigm of value-driven social interactions.

### Core Features
- **Token-Gated Posts**: Content requiring specific token amounts for access
- **Stellar Integration**: Seamless wallet connection and transaction verification
- **SocialFi Mechanics**: Earn tokens by engaging with content
- **Modern UI/UX**: Intuitive interface with real-time blockchain interactions

## 🏗️ Technical Architecture

### Frontend Stack
```typescript
// Core Technologies
- Next.js 15.3.4 (React Framework)
- React 19.0.0 (UI Library)
- TypeScript 5.0 (Type Safety)
- Styled Components 6.1.19 (CSS-in-JS)

// State Management
- Redux Toolkit 2.8.2 (Global State)
- React Redux 9.2.0 (React Integration)

// Blockchain Integration
- Stellar SDK 13.3.0 (Stellar Operations)
- Soroban Client 1.0.1 (Smart Contracts)
- Stellar Wallets Kit 1.7.5 (Wallet Integration)
- Freighter API 4.1.0 (Wallet Provider)
```

### Project Structure
```
sealit/
├── app/                    # Next.js App Router
├── src/
│   ├── api/               # API clients and services
│   ├── assets/            # Static assets
│   ├── components/        # Reusable UI components
│   ├── constants/         # Application constants
│   ├── hooks/             # Custom React hooks
│   ├── navigation/        # Navigation logic
│   ├── screens/           # Screen components
│   ├── store/             # Redux Toolkit store
│   ├── theme/             # Styling and theming
│   ├── types/             # TypeScript definitions
│   └── utils/             # Utility functions
```

## ⛓️ Blockchain Integration

### Stellar Network Features
```typescript
// Network Configuration
const network = WalletNetwork.TESTNET;
const server = new Server('https://horizon-testnet.stellar.org');

// Smart Contract Integration
const sorobanClient = new SorobanRpc.Server('https://soroban-testnet.stellar.org');
```

### Token-Gated Content Implementation
```typescript
interface Post {
  id: number;
  content: string;
  token: string;
  amount: number;
  locked: boolean;
  imageUrl?: string;
  user?: User;
}

// Unlock Verification
const verifyUnlockAccess = async (userAddress: string, requiredAmount: number) => {
  const balance = await getTokenBalance(userAddress, token);
  return balance >= requiredAmount;
};
```

### BLND Pool Integration
```typescript
// BLND/XLM Pool Configuration
export const BLEND_POOL_ADDRESS = 'CCLBPEYS3XFK65MYYXSBMOGKUI4ODN5S7SUZBGD7NALUQF64QILLX5B5';
export const BLND_XLM_RATIO = 0.3; // 1 XLM = 0.3 BLND
export const SECURITY_FEE_PERCENTAGE = 0.2; // 20% security fee

// Unlock fee calculation
export const calculateUnlockFee = (xlmAmount: number): number => {
  const baseFee = xlmAmount * BLND_XLM_RATIO;
  const securityFee = baseFee * SECURITY_FEE_PERCENTAGE;
  return Math.round((baseFee + securityFee) * 100) / 100;
};
```

## 🚀 Installation & Setup

### Quick Start
```bash
# Clone and install
git clone https://github.com/enliven17/sealit.git
cd sealit
npm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

### Environment Configuration
```bash
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_BLEND_POOL_ADDRESS=CCLBPEYS3XFK65MYYXSBMOGKUI4ODN5S7SUZBGD7NALUQF64QILLX5B5
```

## 🔧 Key Components

### PostCreateBox Component
Advanced post creation with blockchain integration:
- Typewriter effect for placeholder text
- Image upload and preview
- Token amount selection
- Blockchain transaction verification
- Supply modal integration

### WalletConnectButton Component
Multi-wallet support with Stellar Wallets Kit:
- Freighter, Albedo, and other wallet support
- Seamless connection handling
- Address display and management
- Disconnect functionality

### PostFeed Component
Dynamic post feed with unlock functionality:
- Chronological post display
- Lock/unlock state management
- Token verification for content access
- Interactive post interactions

## 📊 State Management

### Redux Toolkit Implementation
```typescript
// Posts Slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    unlockPost: (state, action: PayloadAction<number>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) post.locked = false;
    },
  },
});

// Wallet Slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connect: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
      state.isConnected = true;
    },
    disconnect: (state) => {
      state.address = null;
      state.isConnected = false;
    },
  },
});
```

## 🎨 Styling & Theme

### Theme System
```typescript
export const theme = {
  colors: {
    background: '#111216',
    card: '#181c24',
    border: '#23272f',
    primary: '#36B04A',
    primaryDark: '#258034',
    accent: '#ffb300',
    text: '#fff',
    textSecondary: '#b3b8c5',
  },
  spacing: {
    xs: 6, sm: 12, md: 20, lg: 32, xl: 48,
  },
  font: {
    family: 'Inter, Arial, sans-serif',
    size: '16px',
    weight: { normal: 400, bold: 700 },
  },
};
```

## 🔌 API Integration

### Stellar API Services
```typescript
// Token balance checking
export const getTokenBalance = async (address: string, asset: string) => {
  const account = await server.loadAccount(address);
  // Filter and return specific asset balance
};

// Transaction verification
export const verifyTransaction = async (txHash: string) => {
  const transaction = await server.loadTransaction(txHash);
  return transaction;
};
```

## 📋 Development Guidelines

### Code Standards
- **TypeScript**: Strict typing with no `any` types
- **ESLint**: Code quality and consistency
- **Absolute Imports**: Use `@/` prefix for imports
- **Component-Based Architecture**: Modular, reusable components

### State Management Rules
- **Redux Toolkit**: Global state management
- **Local State**: Component-specific state
- **Custom Hooks**: Reusable logic encapsulation
- **Type Safety**: Full TypeScript implementation

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
```bash
NEXT_PUBLIC_STELLAR_NETWORK=public
NEXT_PUBLIC_HORIZON_URL=https://horizon.stellar.org
NEXT_PUBLIC_SOROBAN_URL=https://soroban.stellar.org
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the future of SocialFi on Stellar**