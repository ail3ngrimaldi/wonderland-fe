# 🌍 Impact Wallet - Blockchain Challenge


A modern React + TypeScript Web3 application that enables users to mint, transfer, and manage ERC-20 tokens on the Sepolia testnet with an impact-focused user experience.


## 🚀 Quick Start


### Prerequisites
- Node.js 20.19+ or 22.12+ (required by Vite)
- npm or pnpm
- MetaMask browser extension

### Installation & Setup


```bash
# Clone the repository
git clone [<repository-url>](https://github.com/ail3ngrimaldi/wonderland-fe)

cd wonderland-fe
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:5173
```


### Testing Setup (Important!)

**Step 1: Get Sepolia ETH**
- Add Sepolia testnet to MetaMask (Chain ID: 11155111)
- Get free Sepolia ETH from: https://sepoliafaucet.com/ or https://sepolia-faucet.pk910.de/#/
- You need ETH for gas fees to perform transactions

**Step 2: Create Multiple Accounts**
- Create at least 2 accounts in MetaMask for testing transfers
- Switch between accounts to see token transactions from different perspectives

**Step 3: Add Custom Tokens to MetaMask**
After minting tokens, manually add them in MetaMask to see your balance:
- Click "Import tokens" in MetaMask
- Add custom token with these addresses:
  - **DAI**: `0x1D70D57ccD2798323232B2dD027B3aBcA5C00091`
  - **USDC**: `0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47`


## 📋 Available Scripts

You can run these commands from the project root directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run unit tests |
| `npm run test:ui` | Run tests with UI |
| `npm run lint` | Check code quality |
| `npm run preview` | Preview production build |


## 🏗️ Architecture & Key Decisions


### **Tech Stack Used**
- **Frontend**: React 19 + TypeScript + Vite
- **Web3**: Wagmi v2 + RainbowKit + Viem
- **UI**: Material-UI (MUI) with custom theme
- **Routing**: React Router v7
- **Testing**: Vitest + Testing Library + JSDOM
- **State Management**: React Context + Tanstack Query


### **Project Structure**

```
src/
├── components/
│   ├── features/           # Business logic components
│   │   ├── EventTable.tsx     # Transaction history display
│   │   ├── MintButtons.tsx    # Token minting operations
│   │   ├── NetworkStatus.tsx  # Network connection status
│   │   ├── TokenBalances.tsx  # User balance display
│   │   └── TokenOperations.tsx # Token transfer operations
│   └── ui/                 # Reusable UI components
│       ├── ActionCard.tsx     # Navigation cards
│       ├── BackButton.tsx     # Navigation back button
│       ├── Header.tsx         # App header with wallet connection
│       ├── HeroSection.tsx    # Main dashboard landing
│       └── HistoryButton.tsx  # Transaction history navigation
├── config/             # App configuration
│   ├── contracts.ts    # Smart contract addresses & ABIs
│   └── wagmi.ts        # Web3 configuration
├── context/            # React Context providers
│   └── TransactionContext.tsx # Transaction state management
├── hooks/                  # Custom React hooks
│   └── useTransactionDetails.tsx # Transaction data fetching
├── theme/                  # UI theme system
│   ├── index.ts              # Theme configuration
│   └── types.ts              # Theme TypeScript definitions
├── utils/                  # Helper functions
│   └── tokenUtils.ts         # Token formatting and conversion utilities
├── assets/                 # Static assets
│   └── react.svg             # React logo
├── App.tsx                 # Main app component
├── main.tsx                # App entry point
├── App.css                 # Global app styles
├── index.css               # Base styles
└── vite-env.d.ts           # Vite environment types
```


### **Key Architectural Decisions**


#### **1. Address Validation Strategy**
- **Hierarchical validation**: Address validation handled at high-level components (Header, HeroSection) to avoid prop drilling
- **Context-aware UI**: Components automatically show/hide based on wallet connection state
- **Centralized wallet state**: Single source of truth for address validation across the app

#### **2. Transaction Persistence**
- **Local Storage**: Transaction hashes stored in browser localStorage for session persistence
- **Structured data model**: Each transaction includes hash, type, timestamp, token info for comprehensive tracking
- **Context-based management**: TransactionContext provides global access to transaction history
- **Automatic cleanup**: Invalid or old transactions can be cleared from localStorage

#### **3. Network Guidance System**
- **Sepolia-first approach**: UI components guide users specifically to Sepolia testnet
- **Visual indicators**: Clear network status with switch prompts when on wrong network
- **Educational messaging**: Explicit instructions about Sepolia being the only network with test tokens
- **Automatic switching**: NetworkStatus component provides one-click network switching

#### **4. Component Separation Strategy**
- **features/ vs ui/**: Business logic components separated from pure UI components
- **Single responsibility**: Each component handles one specific blockchain operation or UI pattern
- **Hook extraction**: Custom hooks isolate Web3 logic from presentation logic
- **TypeScript foundation**: Basic type definitions for core data structures (transaction context, component props)

#### **5. Testing Architecture**
- **Centralized mocking**: Mostly all Web3 interactions mocked in `tests/__mocks__/blockchain-mocks.ts`
- **Real own components rendering**: Full component testing over shallow rendering for accurate behavior validation
- **Blockchain simulation**: Mock contracts, addresses, and transaction responses for reliable and simple testing


## 💡 Core Features availables


### **🔗 Wallet Integration**
- Multi-wallet support via RainbowKit
- Automatic network switching to Sepolia
- Real-time connection status
- Wallet balance display with auto-refresh


### **💰 Token Operations**
- **Mint Tokens**: Create new DAI/USDC tokens
- **Transfer Tokens**: Send tokens to any address
- **Approve Tokens**: Set spending allowances (it can just be checked on the History page or with etherscan, since I havent applied the transactionFrom function, which is used to transfer the "lended" tokens)
- **Balance Tracking**: Real-time balance updates


### **📊 Transaction Management**
- **History Tracking**: Persistent transaction log
- **Real-time Status**: Block confirmations & gas usage
- **Etherscan Integration**: Direct links to transaction details
- **Impact Labeling**: User-friendly action descriptions


### **🎨 User Experience**
- **Dashboard Navigation**: Action cards for different operations
- **Network Notifications**: Clear status indicators
- **Loading States**: Smooth async operation feedback
- **Error Handling**: Graceful failure management


## 🧪 Testing


### **Test Coverage: 54 tests passing**


```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run specific test file
npm test TokenBalances
```


### **Testing Architecture**
- **Centralized Mocks**: `src/test/blockchain-mocks.ts`
- **Component Tests**: Individual component behavior
- **Integration Tests**: Some multi-component interactions were added
- **Mock Strategy**: Web3 hooks mocked, components rendered fully


### **Key Test Files**
- `EventTable.test.tsx` - Transaction history display
- `TokenBalances.test.tsx` - Balance fetching & display
- `Header.test.tsx` - Network status & navigation
- `HeroSection.test.tsx` - Dashboard functionality
- `MintButtons.test.tsx` - Token operations


## 🔧 Configuration


### **Smart Contracts (Sepolia)**
```typescript
// src/config/contracts.ts
export const SEPOLIA_CONTRACTS = {
 DAI: '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091',
 USDC: '0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47',
}
```


### **Web3 Configuration**
```typescript
// src/config/wagmi.ts
- Sepolia testnet configuration
- RainbowKit wallet providers
- Tanstack Query client setup
```


## 🔍 Development Workflow

**All commands**: Run from project root directory

### **1. Component Development**
```bash
# Create new component
touch src/components/NewComponent.tsx
touch src/components/__tests__/NewComponent.test.tsx
```


### **2. Testing Workflow**
```bash
# TDD preferrable
npm test NewComponent --watch

# Implement component
# Verify tests pass
npm test
```


### **3. Web3 Integration**
```typescript
// Use Wagmi hooks for blockchain interaction
import { useAccount, useBalance, useWriteContract } from 'wagmi'


// Follow established patterns from existing components
// Add to centralized mocks for testing
```


## 🚨 Common Issues & Solutions


### **Wallet Connection Issues**
- Ensure MetaMask is installed and unlocked
- Check network is set to Sepolia testnet
- Clear browser cache if connection fails


### **Test Failures**
- Run `npm test --run` for one-time execution
- Check `src/test/blockchain-mocks.ts` for mock updates
- Ensure Jest DOM matchers are imported in test files


### **Build Issues**
- Verify Node.js version (20.19+ or 22.12+ required by Vite)
- Clear `node_modules` and reinstall dependencies
- Check TypeScript compilation with `npm run build`

## 📄 License


This project is part of a technical challenge and is intended for educational purposes.


---


**Built with ❤️ using React, TypeScript, and Web3 technologies**



