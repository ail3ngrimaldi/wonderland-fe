import { render, screen } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { TokenBalances } from '../../src/components/features/TokenBalances'
import { SEPOLIA_CONTRACTS } from '../../src/config/contracts'
import {
  mockUseAccount,
  mockUseBalance,
  createMockUseAccount,
  createMockUseBalance
} from '../__mocks__/blockchain-mocks'

vi.mock('wagmi', () => ({
  useAccount: (args: any) => mockUseAccount(args),
  useBalance: (args: any) => mockUseBalance(args),
}))

describe('TokenBalances', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading state initially', () => {
    mockUseAccount.mockReturnValue(createMockUseAccount())
    mockUseBalance
      .mockReturnValueOnce(createMockUseBalance('DAI', { isLoading: true }))
      .mockReturnValueOnce(createMockUseBalance('USDC', { isLoading: true }))

    render(<TokenBalances />)

    expect(screen.queryByText('1.500000')).not.toBeInTheDocument()
expect(screen.queryByText('2.000000')).not.toBeInTheDocument()
  })

  it('should render token balances', () => {
    mockUseAccount.mockReturnValue(createMockUseAccount())
    mockUseBalance
      .mockReturnValueOnce(createMockUseBalance('DAI'))
      .mockReturnValueOnce(createMockUseBalance('USDC'))

    render(<TokenBalances />)

    expect(screen.getByText('Token Balances')).toBeInTheDocument()
    expect(screen.getByText('DAI')).toBeInTheDocument()
    expect(screen.getByText('USDC')).toBeInTheDocument()
    expect(screen.getByText('1.500000')).toBeInTheDocument()
    expect(screen.getByText('2.000000')).toBeInTheDocument()
  })

  it('should configure 5-second refetch intervals', () => {
    mockUseAccount.mockReturnValue(createMockUseAccount())
    mockUseBalance
      .mockReturnValueOnce(createMockUseBalance('DAI'))
      .mockReturnValueOnce(createMockUseBalance('USDC'))

    render(<TokenBalances />)

    expect(mockUseBalance).toHaveBeenNthCalledWith(1, {
      address: expect.any(String),
      token: SEPOLIA_CONTRACTS.DAI,
      chainId: 11155111,
      query: { refetchInterval: 5000 },
    })

    expect(mockUseBalance).toHaveBeenNthCalledWith(2, {
      address: expect.any(String),
      token: SEPOLIA_CONTRACTS.USDC,
      chainId: 11155111,
      query: { refetchInterval: 5000 },
    })
  })
})