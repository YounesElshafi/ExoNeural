import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '../Header'

describe('Header', () => {
  it('renders the main title', () => {
    render(<Header />)
    expect(screen.getByText('ExoNeural')).toBeInTheDocument()
  })

  it('renders the subtitle', () => {
    render(<Header />)
    expect(screen.getByText(/Advanced AI-powered exoplanet detection system/)).toBeInTheDocument()
  })

  it('renders the NASA Space Apps Challenge badge', () => {
    render(<Header />)
    expect(screen.getByText('NASA Space Apps Challenge 2025')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })
})
