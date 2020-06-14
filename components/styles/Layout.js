import styled from 'styled-components'

import device from '../../config/device'

export default styled.div`
  background: ${props => props.theme.background};
  color: ${props => props.theme.color};
  padding: ${props => !props.full && '1rem'};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  a {
    color: ${props => props.theme.linkColor};
    text-decoration: none;
  }
  main {
    flex-grow: 1;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
    justify-content: ${props => props.center && 'center'};

    > * {
      flex: ${props => props.full && '1 0 auto'};
    }

    > *:not(:last-child) {
      margin-bottom: 1rem;
    }

    @media ${device.tablet} {
      width: ${props => !props.full && '100vh'};
      margin: ${props => !props.full && '0 auto'};
    }
  }
`
