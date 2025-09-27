//Centralized mocks for testing
import { vi } from 'vitest'
import React from 'react'

export const MOCK_ADDRESSES = {
  CONNECTED_USER: '0x1234567890123456789012345678901234567890',
  RECIPIENT: '0x9876543210987654321098765432109876543210',
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000'
} as const

export const MOCK_CHAINS = {
  SEPOLIA: { id: 11155111, name: 'Sepolia' },
  MAINNET: { id: 1, name: 'Ethereum' },
  POLYGON: { id: 137, name: 'Polygon' }
} as const

export const MOCK_BALANCES = {
  DAI: {
    value: BigInt('1500000000000000000'),
    formatted: '1.500000',
    symbol: 'DAI',
    decimals: 18
  },
  USDC: {
    value: BigInt('2000000'),
    formatted: '2.000000',
    symbol: 'USDC', 
    decimals: 6
  }
} as const

export const MOCK_TRANSACTIONS = {
  MINT_TX: {
    hash: '0xabcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234',
    blockNumber: BigInt(1000000),
    gasUsed: BigInt(65000),
    timestamp: Date.now(),
    type: 'mint',
    tokenSymbol: 'DAI',
    amount: '100.0'
  },
  TRANSFER_TX: {
    hash: '0xefgh5678901234efgh5678901234efgh5678901234efgh5678901234efgh5678',
    blockNumber: BigInt(1000001),
    gasUsed: BigInt(45000),
    timestamp: Date.now() - 60000,
    type: 'transfer',
    tokenSymbol: 'USDC',
    amount: '50.0'
  }
} as const

export const createMockUseAccount = (overrides = {}) => ({
  address: MOCK_ADDRESSES.CONNECTED_USER,
  isConnected: true,
  chain: MOCK_CHAINS.SEPOLIA,
  ...overrides
})

export const createMockUseBalance = (token: 'DAI' | 'USDC', overrides = {}) => ({
  data: MOCK_BALANCES[token],
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
  ...overrides
})

export const createMockUseSwitchChain = () => ({
  switchChain: vi.fn(),
  isLoading: false,
  isSuccess: false,
  isError: false
})

export const createMockUseWriteContract = (overrides = {}) => ({
  writeContract: vi.fn(),
  isPending: false,
  data: null,
  error: null,
  reset: vi.fn(),
  ...overrides
})

export const createMockUseWaitForTransactionReceipt = (overrides = {}) => ({
  isLoading: false,
  isSuccess: false,
  data: null,
  error: null,
  ...overrides
})

export const createMockTransactionContext = () => ({
  addTransaction: vi.fn(),
  transactions: [],
  clearTransactions: vi.fn()
})

export const MockConnectButton = ({ showBalance = false }: { showBalance?: boolean }) => {
  return React.createElement('div', { 'data-testid': 'connect-button' }, [
    React.createElement('button', { 'data-testid': 'wallet-connect', key: 'button' }, 'Connect Wallet'),
    showBalance && React.createElement('span', { 'data-testid': 'wallet-balance', key: 'balance' }, '1.5 ETH')
  ])
}

export const mockUseAccount = vi.fn()
export const mockUseBalance = vi.fn()

export const mockWagmiHooks = () => {
  vi.mock('wagmi', () => ({
    useAccount: vi.fn(() => createMockUseAccount()),
    useBalance: vi.fn(() => createMockUseBalance('DAI')),
    useContractWrite: vi.fn(() => createMockUseWriteContract()),
    useSwitchChain: vi.fn(() => createMockUseSwitchChain()),
    useChainId: vi.fn(() => MOCK_CHAINS.SEPOLIA.id),
    useBlockNumber: vi.fn(() => ({ data: BigInt(1000000) }))
  }))
}

export const mockRainbowKit = () => {
  vi.mock('@rainbow-me/rainbowkit', () => ({
    ConnectButton: MockConnectButton
  }))
}

export const mockWagmiChains = () => {
  vi.mock('wagmi/chains', () => ({
    sepolia: MOCK_CHAINS.SEPOLIA
  }))
}

export const mockTransactionContext = () => {
  const mockAddTransaction = vi.fn()
  const mockClearTransactions = vi.fn()
  
  vi.mock('../context/TransactionContext', () => ({
    useTransactions: () => ({
      addTransaction: mockAddTransaction,
      transactions: [],
      clearTransactions: mockClearTransactions
    }),
    TransactionProvider: ({ children }: { children: React.ReactNode }) => children
  }))
  
  return {
    mockAddTransaction,
    mockClearTransactions
  }
}