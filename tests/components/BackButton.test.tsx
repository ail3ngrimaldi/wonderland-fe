import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BackButton } from '../../src/components/ui/BackButton'
import { testNavigationButton } from '../navigationButtonTest'
import { BrowserRouter } from 'react-router-dom'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('BackButton', () => {
  beforeEach(() => vi.clearAllMocks())

  testNavigationButton({
    component: (
      <BrowserRouter>
        <BackButton />
      </BrowserRouter>
    ),
    buttonText: 'Back to Home',
    iconText: '⬅️',
    expectedRoute: '/',
    mockNavigate,
  })
})

describe('BackButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with correct text', () => {
    render(<BackButton />)

    expect(screen.getByText('Back to Home')).toBeInTheDocument()
  })

  it('calls navigate with "/" when clicked', () => {
    render(<BackButton />)

    const button = screen.getByText('Back to Home')
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/')
    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })
})
