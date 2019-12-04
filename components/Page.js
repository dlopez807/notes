import { node, object } from "prop-types";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

import Meta from "./Meta";
// import device from '../config/device';
// import Footer from "./Footer";

const colors = {
  black: '#000',
  white: '#cccccc',
  cobalt: '#193549'
}

const theme = {
  background: colors.white,
  color: colors.black,
  dark: {
    background: colors.black,
    color: colors.white
  },
  cobalt: {
    background: colors.cobalt,
    color: colors.white
  }
};

const StyledPage = styled.div`
  background: ${props => props.theme.background};
  color: ${props => props.theme.color};
  height: 100%;
  a {
    color: ${props => props.theme.linkColor};
    text-decoration: none;
  }
`;

const Main = styled.main`
  height: 100%;
`;

const GlobalStyles = createGlobalStyle`
  html, body {
    height: 100vh;
    width: 100vw;
  }
  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 2rem;
    line-height: 2;
    font-family: 'Arial';
  }
  html, body {
  position: fixed;
  overflow: hidden;
  /* height: 100%;
  width: 100%; */
}
`

const Page = ({ children }) => (
  <ThemeProvider theme={theme}>
    <StyledPage>
      <GlobalStyles />
      <Meta />
      <Main>{children}</Main>
    </StyledPage>
  </ThemeProvider>
);

Page.propTypes = {
  children: node.isRequired
};

export default Page;
