import styled from 'styled-components'
import device from '../../config/device'

export default styled.div`
  > * {
    margin-bottom: 1rem;
  }
  padding: 1rem;
  header {
    display: flex;
    align-items: center;
    > * {
      margin-right: 1rem;
    }
    h1 {
      svg {
        color: ${props => props.theme.logo.color};
      }
      span {
        display: none;
      }
    }
    a {
      color: ${props => props.theme.color};
      display: flex;
      align-items: center;
    }
  }
  @media ${device.tablet} {
    width: 100vh;
    margin: 0 auto;
    header {
      h1 {
        flex-grow: 1;
        span {
          display: inline;
        }
      }
    }
  }
`
