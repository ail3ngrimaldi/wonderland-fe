import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from '../Header'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Mock RainbowKit (it requires complex setup)
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <div data-testid="connect-button">Connect Wallet</div>
}))

// Mock NetworkStatus component
vi.mock('../NetworkStatus', () => ({
  NetworkStatus: () => <div data-testid="network-status">Network Status</div>
}))

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Impact Wallet title', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    
    expect(screen.getByText('🌱 Impact Wallet')).toBeInTheDocument()
    expect(screen.getByText('Testnet')).toBeInTheDocument()
  })

  it('navigates to home when title is clicked', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    
    const title = screen.getByText('🌱 Impact Wallet')
    fireEvent.click(title)
    
    expect(mockNavigate).toHaveBeenCalledWith('/')
    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })

  it('renders connect button and network status', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    )
    
    expect(screen.getByTestId('connect-button')).toBeInTheDocument()
    expect(screen.getByTestId('network-status')).toBeInTheDocument()
  })
})