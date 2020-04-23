import styled from 'styled-components';

export default styled.textarea`
  border: none !important;
  overflow: auto;
  outline: none !important;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;

  width: 100%;
  height: 100vh;
  font-size: 3vh;
  font-family: Arial, Helvetica;
  padding: 5px;
  box-sizing: border-box;
  border: none;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  &.dark {
    background: ${props => props.theme.dark.background};
    color: ${props => props.theme.dark.color};
  }

  &.cobalt {
    background: ${props => props.theme.cobalt.background};
    color: ${props => props.theme.cobalt.color};
  }
`;
