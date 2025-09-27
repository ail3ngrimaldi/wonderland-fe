import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ActionCard } from '../ActionCard'

describe('ActionCard', () => {
  const mockProps = {
    icon: '🌱',
    title: 'Plant Seeds',
    description: 'Generate eco-tokens to support sustainable projects',
    buttonText: 'Start Planting',
    color: '#4CAF50',
    onClick: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with basic props', () => {
    render(<ActionCard {...mockProps} />)
    
    expect(screen.getByText('🌱')).toBeInTheDocument()
    expect(screen.getByText('Plant Seeds')).toBeInTheDocument()
    expect(screen.getByText('Generate eco-tokens to support sustainable projects')).toBeInTheDocument()
    expect(screen.getByTestId('action-card-button')).toBeInTheDocument()
    })

  it('calls onClick when button is clicked', () => {
    render(<ActionCard {...mockProps} />)
    
    const button = screen.getByTestId('action-card-button')
    fireEvent.click(button)
    
    expect(mockProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('calls onClick when card is clickable and clicked', () => {
    render(<ActionCard {...mockProps} clickableCard={true} />)
    
    const card = screen.getByTestId('action-card')
    fireEvent.click(card)
    
    expect(mockProps.onClick).toHaveBeenCalledTimes(1)
  })

  it('does not render button when clickableCard is true', () => {
    render(<ActionCard {...mockProps} clickableCard={true} />)
    
    expect(screen.queryByTestId('action-card-button')).not.toBeInTheDocument()    
  })
})