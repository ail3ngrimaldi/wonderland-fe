import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MintButtons } from '../../src/components/features/MintButtons'
import {
  createMockUseAccount,
  createMockUseWriteContract,
  createMockUseWaitForTransactionReceipt,
  MOCK_CHAINS,
} from '../__mocks__/blockchain-mocks'

const mockUseAccount = vi.fn()
const mockUseWriteContract = vi.fn()
const mockUseWaitForTransactionReceipt = vi.fn()
const mockUseChainId = vi.fn()

vi.mock('wagmi', () => ({
  useAccount: () => mockUseAccount(),
  useWriteContract: () => mockUseWriteContract(),
  useWaitForTransactionReceipt: () => mockUseWaitForTransactionReceipt(),
  useChainId: () => mockUseChainId(),
}))

vi.mock('wagmi/chains', () => ({
  sepolia: { id: 11155111, name: 'Sepolia' },
}))

vi.mock('../../src/config/contracts', () => ({
  SEPOLIA_CONTRACTS: {
    DAI: '0xDAI_ADDRESS',
    USDC: '0xUSDC_ADDRESS',
  },
  ERC20_ABI: [],
  TOKEN_DECIMALS: {
    DAI: 18,
    USDC: 6,
  },
}))

const mockAddTransaction = vi.fn()
const mockClearTransactions = vi.fn()

vi.mock('../../src/context/TransactionContext', () => ({
  useTransactions: () => ({
    addTransaction: mockAddTransaction,
    transactions: [],
    clearTransactions: mockClearTransactions,
  }),
  TransactionProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}))

describe('MintButtons', () => {
  const user = userEvent.setup()
  const mockWriteContract = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseWaitForTransactionReceipt.mockReturnValue({
      isLoading: false,
      isSuccess: false,
      data: null,
      error: null,
    })
  })

  describe('When connected to Sepolia', () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(createMockUseAccount())
      mockUseWriteContract.mockReturnValue(
        createMockUseWriteContract({
          writeContract: mockWriteContract,
        })
      )
      mockUseChainId.mockReturnValue(MOCK_CHAINS.SEPOLIA.id)
    })

    it('should display mint buttons for both tokens', () => {
      render(<MintButtons />)

      expect(screen.getByText('Create 10 DAI')).toBeInTheDocument()
      expect(screen.getByText('Create 10 USDC')).toBeInTheDocument()
      expect(screen.getByText('🌱 Plant Seeds')).toBeInTheDocument()
    })

    it('should call writeContract when DAI button clicked', async () => {
      render(<MintButtons />)
      const daiButton = screen.getByText('Create 10 DAI')
      await user.click(daiButton)

      expect(mockWriteContract).toHaveBeenCalledTimes(1)
    })

    it('should call writeContract when USDC button clicked', async () => {
      render(<MintButtons />)
      const usdcButton = screen.getByText('Create 10 USDC')
      await user.click(usdcButton)

      expect(mockWriteContract).toHaveBeenCalledTimes(1)
    })

    it('should show pending state correctly', () => {
      mockUseWriteContract.mockReturnValue(
        createMockUseWriteContract({
          writeContract: mockWriteContract,
          isPending: true,
          data: '0x123hash',
        })
      )

      render(<MintButtons />)

      expect(screen.getByText('Create 10 DAI')).toBeInTheDocument()
      expect(screen.getByText('Create 10 USDC')).toBeInTheDocument()
    })

    it('should show loading text when minting DAI', async () => {
      const writeContractMock = vi.fn()
      mockUseWriteContract.mockReturnValue(
        createMockUseWriteContract({
          writeContract: writeContractMock,
          isPending: true,
          data: '0x123hash',
        })
      )

      render(<MintButtons />)
      await user.click(screen.getByText('Create 10 DAI'))

      expect(screen.getByText('Planting DAI Seeds...')).toBeInTheDocument()
    })

    it('should show success state after successful mint', () => {
      mockUseWaitForTransactionReceipt.mockReturnValue(
        createMockUseWaitForTransactionReceipt({
          isLoading: false,
          isSuccess: true,
          data: { to: '0xDAI_ADDRESS', blockNumber: 123 },
        })
      )

      mockUseWriteContract.mockReturnValue(
        createMockUseWriteContract({
          writeContract: mockWriteContract,
          data: '0x123hash',
        })
      )

      render(<MintButtons />)

      expect(
        screen.getByText('Seeds Planted Successfully!')
      ).toBeInTheDocument()
      expect(mockAddTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mint',
          tokenSymbol: expect.any(String),
          amount: '10',
        })
      )
    })
  })

  describe('When connected to wrong network', () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(
        createMockUseAccount({
          isConnected: true,
          chain: MOCK_CHAINS.MAINNET, // o cualquier red ≠ Sepolia
        })
      )
      mockUseChainId.mockReturnValue(MOCK_CHAINS.MAINNET.id)
      mockUseWriteContract.mockReturnValue(
        createMockUseWriteContract({
          writeContract: vi.fn(),
        })
      )
    })

    it('should show warning to switch network', () => {
      render(<MintButtons />)
      expect(
        screen.getByText(/Please switch to Sepolia testnet/)
      ).toBeInTheDocument()
    })

    it('should disable mint buttons', () => {
      render(<MintButtons />)
      expect(screen.getByText('Create 10 DAI')).toBeDisabled()
      expect(screen.getByText('Create 10 USDC')).toBeDisabled()
    })
  })

  describe('Error handling', () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(createMockUseAccount())
      mockUseWriteContract.mockReturnValue(createMockUseWriteContract())
    })

    it('should display error message when mint fails', () => {
      mockUseWriteContract.mockReturnValue(
        createMockUseWriteContract({
          writeContract: mockWriteContract,
          error: { message: 'Insufficient gas' },
        })
      )

      render(<MintButtons />)

      expect(
        screen.getByText('Eco-token couldnt be created :(')
      ).toBeInTheDocument()
      expect(screen.getByText('Insufficient gas')).toBeInTheDocument()
    })

    it('should show receipt error when transaction confirmation fails', () => {
      mockUseWriteContract.mockReturnValue(createMockUseWriteContract())
      mockUseWaitForTransactionReceipt.mockReturnValue(
        createMockUseWaitForTransactionReceipt({
          error: { message: 'Transaction receipt error' },
        })
      )

      render(<MintButtons />)

      expect(
        screen.getByText('Unable to confirm planting :')
      ).toBeInTheDocument()
      expect(screen.getByText('Transaction receipt error')).toBeInTheDocument()
    })
  })
})
