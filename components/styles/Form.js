import styled from 'styled-components'

import device from '../../config/device'

export default styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  h1,
  input,
  button {
    text-align: center;
  }
  input,
  button {
    width: 100%;
    margin-top: 1rem;
    border: none;
    border-radius: 0.25rem;
    padding: 1rem;
  }
  button {
    background: ${props => props.theme.form.button.background};
    color: ${props => props.theme.form.button.color};
    &[disabled] {
      background: ${props => props.theme.form.button.disabled.background};
      color: ${props => props.theme.form.button.disabled.color};
    }
  }
  .error {
    color: red;
  }
  @media ${device.tablet} {
    width: 50vh;
    margin: 0 auto;
  }
`
