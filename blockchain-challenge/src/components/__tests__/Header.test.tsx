import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Header } from '../Header'
import { 
  createMockUseAccount, 
  MOCK_CHAINS 
} from '../../test/blockchain-mocks'

const mockSwitchChain = vi.fn()
const mockUseAccount = vi.fn()

vi.mock('wagmi', () => ({
  useAccount: () => mockUseAccount(),
  useSwitchChain: () => ({ switchChain: mockSwitchChain })
}))

vi.mock('wagmi/chains', () => ({
  sepolia: { id: 11155111, name: 'Sepolia' }
}))

vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <button data-testid="wallet-connect">Connect Wallet</button>
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Header with NetworkStatus Integration', () => {
  const user = userEvent.setup()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('When wallet is not connected', () => {
    it('should render header without network status', () => {
      mockUseAccount.mockReturnValue(createMockUseAccount({
        isConnected: false,
        chain: null
      }))
      
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )
      
      expect(screen.getByText(/Impact Wallet/i)).toBeInTheDocument()
      expect(screen.queryByTestId('network-status-container')).not.toBeInTheDocument()
    })
  })

  describe('When connected to Sepolia', () => {
    it('should show success message', () => {
      mockUseAccount.mockReturnValue(createMockUseAccount({
        isConnected: true,
        chain: MOCK_CHAINS.SEPOLIA
      }))
      
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )
      
      expect(screen.getByTestId('network-status-container')).toBeInTheDocument()
      expect(screen.getByTestId('network-status-success')).toBeInTheDocument()
      expect(screen.getByText('Successfully connected to Sepolia testnet')).toBeInTheDocument()
      expect(screen.queryByTestId('switch-network-button')).not.toBeInTheDocument()
    })
  })

  describe('When connected to wrong network', () => {
    it('should show warning and switch button', async () => {
      mockUseAccount.mockReturnValue(createMockUseAccount({
        isConnected: true,
        chain: MOCK_CHAINS.MAINNET
      }))
      
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )
      
      expect(screen.getByTestId('network-status-container')).toBeInTheDocument()
      expect(screen.getByTestId('network-status-warning')).toBeInTheDocument()
      expect(screen.getByText(/Careful! For this transaction Sepolia testnet is preferred/)).toBeInTheDocument()
      
      const switchButton = screen.getByText('Switch to Sepolia')
      expect(switchButton).toBeInTheDocument()
    })

    it('should call switchChain when switch button is clicked', async () => {
      mockUseAccount.mockReturnValue(createMockUseAccount({
        isConnected: true,
        chain: MOCK_CHAINS.MAINNET
      }))
      
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )
      
      const switchButton = screen.getByText('Switch to Sepolia')
      await user.click(switchButton)
      
      expect(mockSwitchChain).toHaveBeenCalledWith({ chainId: MOCK_CHAINS.SEPOLIA.id })
      expect(mockSwitchChain).toHaveBeenCalledTimes(1)
    })
  })

  describe('Header navigation', () => {
    it('should navigate home when title is clicked', async () => {
      mockUseAccount.mockReturnValue(createMockUseAccount({
        isConnected: true,
        chain: MOCK_CHAINS.SEPOLIA
      }))
      
      render(
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      )
      
      const title = screen.getByText(/Impact Wallet/i)
      await user.click(title)
      
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })
})