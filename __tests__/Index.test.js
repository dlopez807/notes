import React from 'react'
import { render } from 'test-utils'
import Index from '../pages/index'

it('renders index page', () => {
  const { getByPlaceholderText } = render(<Index />)
  const notepad = getByPlaceholderText('notepad')
  expect(notepad).toBeInTheDocument()
})
