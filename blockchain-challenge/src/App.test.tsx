import { render, screen } from '@testing-library/react'
import App from './App'

describe('App component', () => {
  it('should display the main title', () => {
    render(<App />)
    // screen.debug()
     const title = screen.getByText(/^blockchain challenge$/i)
     expect(title).toBeInTheDocument()
  })
})