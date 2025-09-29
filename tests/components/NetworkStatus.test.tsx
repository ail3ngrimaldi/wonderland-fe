import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NetworkStatus } from '../../src/components/features/NetworkStatus'
import {
  createMockUseAccount,
  MOCK_CHAINS,
} from '../__mocks__/blockchain-mocks'

const mockUseAccount = vi.fn()
const mockSwitchChain = vi.fn()

vi.mock('wagmi', () => ({
  useAccount: () => mockUseAccount(),
  useSwitchChain: () => ({ switchChain: mockSwitchChain }),
}))

vi.mock('wagmi/chains', () => ({
  sepolia: { id: 11155111, name: 'Sepolia' },
}))

describe('NetworkStatus', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('When wallet is not connected', () => {
    it('should not render anything', () => {
      mockUseAccount.mockReturnValue(
        createMockUseAccount({
          isConnected: false,
          chain: null,
        })
      )

      expect(
        screen.queryByTestId('network-status-container')
      ).not.toBeInTheDocument()
    })
  })

  describe('When connected to Sepolia (correct network)', () => {
    it('should show success message', () => {
      mockUseAccount.mockReturnValue(
        createMockUseAccount({
          isConnected: true,
          chain: MOCK_CHAINS.SEPOLIA,
        })
      )

      render(<NetworkStatus />)

      expect(screen.getByTestId('network-status-container')).toBeInTheDocument()
      expect(screen.getByTestId('network-status-success')).toBeInTheDocument()
      expect(
        screen.getByText('Successfully connected to Sepolia testnet')
      ).toBeInTheDocument()

      expect(screen.queryByTestId('switch-button')).not.toBeInTheDocument()
    })
  })

  describe('When connected to wrong network', () => {
    it('should show warning message with switch button', () => {
      mockUseAccount.mockReturnValue(
        createMockUseAccount({
          isConnected: true,
          chain: MOCK_CHAINS.MAINNET,
        })
      )

      render(<NetworkStatus />)

      expect(screen.getByTestId('network-status-warning')).toBeInTheDocument()
      expect(
        screen.getByText(
          /Careful! For this transaction Sepolia testnet is preferred/
        )
      ).toBeInTheDocument()

      const switchButton = screen.getByText('Switch to Sepolia')
      expect(switchButton).toBeInTheDocument()
    })

    it('should call switchChain when switch button is clicked', async () => {
      mockUseAccount.mockReturnValue(
        createMockUseAccount({
          isConnected: true,
          chain: MOCK_CHAINS.POLYGON,
        })
      )

      render(<NetworkStatus />)
      const switchButton = screen.getByText('Switch to Sepolia')
      await user.click(switchButton)

      expect(mockSwitchChain).toHaveBeenCalledWith({
        chainId: MOCK_CHAINS.SEPOLIA.id,
      })
      expect(mockSwitchChain).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge cases', () => {
    it('should handle undefined chain gracefully', () => {
      mockUseAccount.mockReturnValue(
        createMockUseAccount({
          isConnected: true,
          chain: undefined,
        })
      )

      render(<NetworkStatus />)

      expect(screen.getByTestId('network-status-warning')).toBeInTheDocument()
      expect(screen.getByText('Switch to Sepolia')).toBeInTheDocument()
    })

    it('should handle chain without id property', () => {
      mockUseAccount.mockReturnValue(
        createMockUseAccount({
          isConnected: true,
          chain: { id: null },
        })
      )

      render(<NetworkStatus />)

      expect(screen.getByTestId('network-status-warning')).toBeInTheDocument()
    })
  })
})
