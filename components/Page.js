import { useState } from 'react'
import { node } from 'prop-types'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import { Normalize } from 'styled-normalize'
import { ToastContainer } from 'react-toastify'

import Meta from './Meta'
// import device from '../config/device';
import useLocalStorage from '../lib/useLocalStorage'

const colors = {
  black: '#000',
  white: '#cccccc',
  cobalt: '#193549',
  giest: {
    success: {
      default: '#0070F3',
      light: '#3291FF',
      dark: '#0366D6',
    },
    error: {
      default: '#FF0000',
      light: '#FF3333',
      dark: '#E60000',
    },
  },
}

const themes = {
  default: {
    background: colors.white,
    color: colors.black,
    footer: {
      color: colors.white,
      background: colors.cobalt,
      link: {
        color: colors.white,
      },
    },
    notification: {
      success: colors.giest.success.default,
    },
  },
  dark: {
    background: colors.black,
    color: colors.white,
  },
  cobalt: {
    background: colors.cobalt,
    color: colors.white,
  },
}

const Notification = styled(ToastContainer).attrs({
  // custom props
  // autoClose: false,
  autoClose: 3000,
})`
  .Toastify__toast-container {
    padding: 1rem;
    width: auto;
    border-radius: 25px;
  }
  .Toastify__toast {
    color: ${props => props.theme.color};
    margin-bottom: 0;
    min-height: auto;
    border-radius: 3px;
  }
  .Toastify__toast--error {
  }
  .Toastify__toast--warning {
  }
  .Toastify__toast--success {
    /* background: ${props => props.theme.notification.success}; */
    background: ${props => props.theme.notification.success};
  }
  .Toastify__toast-body {
    text-align: center;
  }
  .Toastify__progress-bar {
  }
`

const StyledPage = styled.div`
  background: ${props => props.theme.background};
  color: ${props => props.theme.color};
  a {
    color: ${props => props.theme.linkColor};
    text-decoration: none;
  }
`

const Main = styled.main`
  min-height: 100vh;
  margin: 0 auto;
  padding: 0;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;

  > .content {
    flex: 1 0 auto;
  }
`

const GlobalStyles = createGlobalStyle`
  /* html, body {
    height: 100vh;
    width: 100vw;
  } */
  html {
    box-sizing: border-box;
    font-size: 10px;
    background: ${props => props.theme.background};
    color: ${props => props.theme.color};
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 2rem;
    /* line-height: 2; */
    font-family: 'Arial';
  }
  h1, h2, h3 {
    margin: 0;
  }
  ul, ol {
    margin: 0;
  }
  ul {
    padding: 0;
  }
  pre {
    /* width: 100%; */
    overflow-x: auto;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
    margin: 0
  }
  /* height: 100%;
  width: 100%; */
`

const Page = ({ children }) => {
  const [customTheme, setCustomTheme] = useLocalStorage('theme', 'cobalt')
  const custom = customTheme || 'default'
  const [theme, setTheme] = useState({
    ...themes.default,
    ...themes[custom],
  })
  const updateTheme = newTheme => {
    setCustomTheme(newTheme || 'default')
    setTheme({
      ...themes.default,
      ...themes[newTheme],
    })
  }
  return (
    <ThemeProvider theme={{ ...theme, updateTheme }}>
      <StyledPage>
        <Normalize />
        <GlobalStyles />
        <Meta />
        <Notification />
        <Main>{children}</Main>
      </StyledPage>
    </ThemeProvider>
  )
}

Page.propTypes = {
  children: node.isRequired,
}

export default Page
