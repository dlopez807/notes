import styled from 'styled-components'

export default styled.ul`
  li {
    margin-bottom: 1rem;
    &:last-child {
      margin-bottom: 0;
    }
    input,
    textarea {
      width: 100%;
      border: none;
    }
    textarea {
      height: 25vh;
    }
    input {
      background: ${props => props.theme.background};
      color: ${props => props.theme.color};
    }
    button {
      background: none;
      border: none;
      color: ${props => props.theme.color};
    }
    a {
      color: ${props => props.theme.color};
    }
  }
`
