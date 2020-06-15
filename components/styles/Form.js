import styled from 'styled-components'

import device from '../../config/device'

export default styled.form`
  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
  h1,
  h2,
  input,
  button {
    text-align: center;
  }
  input,
  button {
    width: 100%;
    /* margin-top: 1rem; */
    border: none;
    border-radius: 0.25rem;
    padding: 1rem;
  }
  button {
    display: flex;
    justify-content: center;
    background: ${props => props.theme.form.button.background};
    color: ${props => props.theme.form.button.color};
    &[disabled] {
      background: ${props => props.theme.form.button.disabled.background};
      color: ${props => props.theme.form.button.disabled.color};
    }
    &.delete {
      background: ${props => props.theme.form.button.delete.background};
      &[disabled] {
        background: ${props =>
          props.theme.form.button.delete.disabled.background};
        color: ${props => props.theme.form.button.delete.disabled.color};
      }
    }
  }
  .error {
    color: ${props => props.theme.form.error};
  }
  @media ${device.tablet} {
    width: 50vh;
    margin: 0 auto;
  }
`
