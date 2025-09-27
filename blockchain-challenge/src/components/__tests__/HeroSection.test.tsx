import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { HeroSection } from '../HeroSection'
import { createMockUseAccount } from '../../test/blockchain-mocks'

const mockUseAccount = vi.fn()
vi.mock('wagmi', () => ({
  useAccount: () => mockUseAccount()
}))

vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <button data-testid="connect-button">Connect Wallet</button>
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('HeroSection', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('When wallet is not connected', () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(createMockUseAccount({ 
        isConnected: false 
      }))
    })

    it('should show welcome message and connect wallet prompt', () => {
      render(<BrowserRouter><HeroSection /></BrowserRouter>)
      
      expect(screen.getByText('🌍 Welcome to Impact Wallet')).toBeInTheDocument()
      expect(screen.getByText('To start creating impact, you have to connect your wallet!')).toBeInTheDocument()
      expect(screen.getByText(/Once connected, you'll be able to plant seeds, sponsor projects/)).toBeInTheDocument()
      expect(screen.getByTestId('connect-button')).toBeInTheDocument()
    })

    it('should not show action cards when not connected', () => {
      render(<BrowserRouter><HeroSection /></BrowserRouter>)
      
      expect(screen.queryByTestId('mint')).not.toBeInTheDocument()
      expect(screen.queryByTestId('approve')).not.toBeInTheDocument()
      expect(screen.queryByTestId('transfer')).not.toBeInTheDocument()
      expect(screen.queryByTestId('history')).not.toBeInTheDocument()
    })
  })

  describe('When wallet is connected', () => {
    beforeEach(() => {
      mockUseAccount.mockReturnValue(createMockUseAccount({ 
        isConnected: true 
      }))
    })

    it('should show dashboard with action cards', () => {
      render(<BrowserRouter><HeroSection /></BrowserRouter>)
      
      expect(screen.getByText('🌍 Welcome to your Impact Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Your actions create real change in the world')).toBeInTheDocument()
      
      expect(screen.getByTestId('history')).toBeInTheDocument()
      expect(screen.getByTestId('mint')).toBeInTheDocument()
      expect(screen.getByTestId('approve')).toBeInTheDocument()
      expect(screen.getByTestId('transfer')).toBeInTheDocument()
    })

    it('should navigate to correct routes when action cards are clicked', async () => {
      render(<BrowserRouter><HeroSection /></BrowserRouter>)
      
      await user.click(screen.getByTestId('mint'))
      expect(mockNavigate).toHaveBeenCalledWith('/plant-seeds')

      await user.click(screen.getByTestId('approve'))
      expect(mockNavigate).toHaveBeenCalledWith('/sponsor-project')

      await user.click(screen.getByTestId('transfer'))
      expect(mockNavigate).toHaveBeenCalledWith('/make-impact')

      await user.click(screen.getByTestId('history'))
      expect(mockNavigate).toHaveBeenCalledWith('/impact-history')

      expect(mockNavigate).toHaveBeenCalledTimes(4)
    })

    it('should not show connect wallet prompt when connected', () => {
      render(<BrowserRouter><HeroSection /></BrowserRouter>)
      
      expect(screen.queryByText('To start creating impact, you have to connect your wallet!')).not.toBeInTheDocument()
      expect(screen.queryByTestId('connect-button')).not.toBeInTheDocument()
    })
  })
})