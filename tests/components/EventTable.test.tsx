import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EventTable } from '../../src/components/features/EventTable'
import { MOCK_TRANSACTIONS } from '../__mocks__/blockchain-mocks'

const mockUseTransactions = vi.fn()
const mockUseTransactionDetails = vi.fn()
const mockFormatHash = vi.fn(
  (hash: string) => `${hash.slice(0, 6)}...${hash.slice(-4)}`
)

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}))

vi.mock('../../src/context/TransactionContext', () => ({
  useTransactions: () => mockUseTransactions(),
}))

vi.mock('../../src/hooks/useTransactionDetails', () => ({
  useTransactionDetails: (hash: string) => mockUseTransactionDetails(hash),
}))

vi.mock('../../src/utils/tokenUtils', () => ({
  formatHash: (hash: string) => mockFormatHash(hash),
}))

describe('EventTable', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('When there are no transactions', () => {
    it('should show empty state message', () => {
      mockUseTransactions.mockReturnValue({
        transactions: [],
        clearTransactions: vi.fn(),
      })

      render(<EventTable />)

      expect(
        screen.getByText('Your Impact History (0 actions)')
      ).toBeInTheDocument()
      expect(
        screen.getByText('No impact actions yet. Start by planting some seeds!')
      ).toBeInTheDocument()
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
      expect(screen.queryByText('Clear History')).not.toBeInTheDocument()
    })
  })

  describe('When there are transactions', () => {
    const mockClearTransactions = vi.fn()
    const mockTransactions = [
      MOCK_TRANSACTIONS.MINT_TX,
      MOCK_TRANSACTIONS.TRANSFER_TX,
    ]

    beforeEach(() => {
      mockUseTransactions.mockReturnValue({
        transactions: mockTransactions,
        clearTransactions: mockClearTransactions,
      })

      mockUseTransactionDetails.mockImplementation((hash: string) => ({
        data:
          hash === MOCK_TRANSACTIONS.MINT_TX.hash
            ? {
                blockNumber: MOCK_TRANSACTIONS.MINT_TX.blockNumber,
                gasUsed: MOCK_TRANSACTIONS.MINT_TX.gasUsed,
              }
            : null,
        isLoading: false,
      }))
    })

    it('should show loading indicator while fetching details', () => {
      mockUseTransactionDetails.mockReturnValue({
        data: null,
        isLoading: true,
      })

      render(<EventTable />)

      expect(screen.getAllByRole('progressbar')).toHaveLength(2)
    })

    it('should display transaction count and clear button', () => {
      render(<EventTable />)

      expect(
        screen.getByText('Your Impact History (2 actions)')
      ).toBeInTheDocument()
      expect(screen.getByText('Clear History')).toBeInTheDocument()
    })

    it('should display transactions with correct action labels', () => {
      render(<EventTable />)

      expect(screen.getByText('🌱 Planted Seeds (MINT)')).toBeInTheDocument()
      expect(screen.getByText('💚 Made Impact (TRANSFER)')).toBeInTheDocument()
      expect(screen.getByText('DAI')).toBeInTheDocument()
      expect(screen.getByText('USDC')).toBeInTheDocument()
    })

    it('should display transaction details when loaded', () => {
      render(<EventTable />)

      expect(screen.getByText(/Block: 1000000/)).toBeInTheDocument()
      expect(screen.getByText(/Gas: 65000/)).toBeInTheDocument()
    })

    it('should display formatted transaction hashes as links', () => {
      render(<EventTable />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(2)
      expect(links[0]).toHaveAttribute(
        'href',
        `https://sepolia.etherscan.io/tx/${MOCK_TRANSACTIONS.MINT_TX.hash}`
      )
      expect(links[0]).toHaveAttribute('target', '_blank')
    })

    it('should call clearTransactions when clear button clicked', async () => {
      render(<EventTable />)
      const clearButton = screen.getByText('Clear History')
      await user.click(clearButton)

      expect(mockClearTransactions).toHaveBeenCalledTimes(1)
    })
  })

  describe('Transaction formatting', () => {
    it('should format time correctly', () => {
      const recentTransaction = {
        ...MOCK_TRANSACTIONS.MINT_TX,
        timestamp: new Date('2024-01-15T10:30:00Z').getTime(),
      }

      mockUseTransactions.mockReturnValue({
        transactions: [recentTransaction],
        clearTransactions: vi.fn(),
      })

      mockUseTransactionDetails.mockReturnValue({
        data: null,
        isLoading: false,
      })

      render(<EventTable />)

      expect(screen.getByText(/\d{1,2}:\d{2}:\d{2}/)).toBeInTheDocument()
    })

    it('should handle missing transaction data gracefully', () => {
      const incompleteTransaction = {
        hash: '0xincompletehash',
        type: 'unknown',
        timestamp: Date.now(),
      }

      mockUseTransactions.mockReturnValue({
        transactions: [incompleteTransaction],
        clearTransactions: vi.fn(),
      })

      mockUseTransactionDetails.mockReturnValue({
        data: null,
        isLoading: false,
      })

      render(<EventTable />)

      expect(screen.getAllByText('UNKNOWN')).toHaveLength(2)
      expect(screen.getAllByText('---')).toHaveLength(2)
      expect(screen.getByText('0xinco...hash')).toBeInTheDocument()
    })
  })
})
