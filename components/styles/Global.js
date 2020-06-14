import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
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
  p {
    margin: 0;
  }
  pre {
    overflow-x: auto;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
    margin: 0
  }
  /* .ReactModal__Body--open {
    overflow-y: hidden;
  } */
  .ReactModal__Body--open {
    position: static;
    overflow-y: scroll;
  }

  .ReactModal__Html--open {
    overflow-y: hidden;
  }

  .ReactModalPortal {
    position: fixed;
    z-index: 1 !important;
  }
`
