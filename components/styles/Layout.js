import styled from 'styled-components'

export default styled.div`
  background: ${props => props.theme.background};
  color: ${props => props.theme.color};
  a {
    color: ${props => props.theme.linkColor};
    text-decoration: none;
  }
  main {
    min-height: 100vh;
    margin: 0 auto;
    padding: 0;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;

    > .content {
      flex: 1 0 auto;
    }
  }
`
