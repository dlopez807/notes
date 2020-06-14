import styled from 'styled-components'

export default styled.textarea`
  background: ${props => props.theme.input.background};
  color: ${props => props.theme.input.color};
  width: 100%;
  height: 100%;
  resize: none;
  /* font-size: 3vh; */
  font-size: 2rem;
  font-family: Arial, Helvetica;
  padding: 0.5rem;
  /* border: 1px solid ${props => props.theme.input.background}; */
  border: none;
  outline: none;
  box-shadow: none;
  -webkit-overflow-scrolling: touch;
`
