import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default message', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    render(<LoadingSpinner message="Custom loading message" />)
    expect(screen.getByText('Custom loading message')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />)
    expect(screen.getByRole('generic')).toHaveClass('w-4', 'h-4')

    rerender(<LoadingSpinner size="md" />)
    expect(screen.getByRole('generic')).toHaveClass('w-8', 'h-8')

    rerender(<LoadingSpinner size="lg" />)
    expect(screen.getByRole('generic')).toHaveClass('w-12', 'h-12')
  })
})
