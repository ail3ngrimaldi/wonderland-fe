// src/test/utils/navigationButtonTest.tsx
import { it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactElement } from 'react'

interface NavigationButtonTestOptions {
  component: ReactElement
  buttonText: string
  iconText: string
  expectedRoute: string
  mockNavigate: any
}

export const testNavigationButton = ({
  component,
  buttonText,
  iconText,
  expectedRoute,
  mockNavigate,
}: NavigationButtonTestOptions) => {
  it('renders with correct text and icon', () => {
    render(component)
    expect(screen.getByText(buttonText)).toBeInTheDocument()
    expect(screen.getByText(iconText)).toBeInTheDocument()
  })

  it(`navigates to ${expectedRoute} when clicked`, async () => {
    const user = userEvent.setup()
    render(component)
    await user.click(screen.getByText(buttonText))
    expect(mockNavigate).toHaveBeenCalledWith(expectedRoute)
    expect(mockNavigate).toHaveBeenCalledTimes(1)
  })
}
