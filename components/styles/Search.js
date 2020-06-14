import styled from 'styled-components'

export default styled.div`
  display: flex;
  border: 1px solid ${props => props.theme.color};
  border-radius: 10px;
  input,
  button {
    padding: 0.75rem;
    border: none;
    border-radius: 10px;
  }
  input {
    outline: none;
    width: 100%;
    background: ${props => props.theme.background};
    color: ${props => props.theme.color};
  }
  button {
    display: flex;
    align-items: center;
    background: transparent;
    color: ${props => props.theme.form.button.color};
  }
`
