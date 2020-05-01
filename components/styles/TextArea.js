import styled from 'styled-components';

export default styled.textarea`
  background: ${props => props.theme.background};
  color: ${props => props.theme.color};
  width: 100%;
  height: 100%;
  resize: none;
  font-size: 3vh;
  font-family: Arial, Helvetica;
  padding: 5px;
  border: none !important;
  overflow: auto;
  outline: none !important;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
`;
