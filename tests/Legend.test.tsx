import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Legend } from '../src/components/Legend'

describe('Legend component', () => {
  it('renders accessibility labels for key states', () => {
    render(<Legend />)
    expect(screen.getByRole('region', { name: 'Keyboard legend' })).toBeInTheDocument()
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('Heavy conflict')).toBeInTheDocument()
    expect(screen.getByText('Reserved')).toBeInTheDocument()
  })

  it('describes each legend item', async () => {
    render(<Legend />)
    await userEvent.tab()
    expect(screen.getByText('Not bound by any selected profile')).toBeInTheDocument()
  })
})
