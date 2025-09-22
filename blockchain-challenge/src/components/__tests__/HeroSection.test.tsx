import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HeroSection } from '../HeroSection'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Mock ActionCard component
vi.mock('../ActionCard', () => ({
  ActionCard: ({ title, onClick, buttonText }: any) => (
    <div data-testid={`action-card-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <h3>{title}</h3>
      <button onClick={onClick}>{buttonText}</button>
    </div>
  )
}))

describe('HeroSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders welcome message and subtitle', () => {
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    )
    
    expect(screen.getByText('🌍 Welcome to your Impact Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Your actions create real change in the world')).toBeInTheDocument()
  })

  it('renders all action cards', () => {
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    )
    
    expect(screen.getByTestId('action-card-impact-history')).toBeInTheDocument()
    expect(screen.getByTestId('action-card-plant-seeds')).toBeInTheDocument()
    expect(screen.getByTestId('action-card-sponsor-project')).toBeInTheDocument()
    expect(screen.getByTestId('action-card-make-impact')).toBeInTheDocument()
  })

  it('navigates to correct routes when action cards are clicked', () => {
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    )
    
    // Test Plant Seeds navigation
    fireEvent.click(screen.getByText('Start Planting'))
    expect(mockNavigate).toHaveBeenCalledWith('/plant-seeds')
    
    // Test Sponsor Project navigation  
    fireEvent.click(screen.getByText('Become Sponsor'))
    expect(mockNavigate).toHaveBeenCalledWith('/sponsor-project')
    
    // Test Make Impact navigation
    fireEvent.click(screen.getByText('Start Donating'))
    expect(mockNavigate).toHaveBeenCalledWith('/make-impact')
    
    // Test Impact History navigation
    fireEvent.click(screen.getByText('View History'))
    expect(mockNavigate).toHaveBeenCalledWith('/impact-history')
    
    expect(mockNavigate).toHaveBeenCalledTimes(4)
  })
})