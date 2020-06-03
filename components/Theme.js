import { ThemeProvider } from 'styled-components'

import useTheme from '../lib/useTheme'

export default ({ children }) => {
  const theme = useTheme()
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
