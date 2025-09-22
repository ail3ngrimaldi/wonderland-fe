import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { BackButton } from '../BackButton'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('BackButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with correct text and icon', () => {
    render(
      <BrowserRouter>
        <BackButton />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument()
    expect(screen.getByText('⬅️')).toBeInTheDocument()
  })

  it('calls navigate with "/" when clicked', () => {
    render(
      <BrowserRouter>
        <BackButton />
      </BrowserRouter>
    )
    
    const button = screen.getByText('Back to Dashboard')
    fireEvent.click(button)
    
    expect(mockNavigate).toHaveBeenCalledWith('/')
    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })
})