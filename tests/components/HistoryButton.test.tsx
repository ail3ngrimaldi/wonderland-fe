import { describe, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { HistoryButton } from '../../src/components/ui/HistoryButton'
import { testNavigationButton } from '../navigationButtonTest'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('HistoryButton', () => {
  beforeEach(() => vi.clearAllMocks())

  testNavigationButton({
    component: (
      <BrowserRouter>
        <HistoryButton />
      </BrowserRouter>
    ),
    buttonText: 'View Impact History',
    iconText: '📊',
    expectedRoute: '/impact-history',
    mockNavigate,
  })
})
