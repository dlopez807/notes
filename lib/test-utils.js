// test-utils.js
import React from 'react'
import { render } from '@testing-library/react'
import Theme from '../components/Theme'

const AllTheProviders = ({ children }) => {
  return <Theme>{children}</Theme>
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
