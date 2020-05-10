// test-utils.js
import React from 'react'
import { render } from '@testing-library/react'
import Page from '../components/Page'

const AllTheProviders = ({ children }) => {
  return <Page>{children}</Page>
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
