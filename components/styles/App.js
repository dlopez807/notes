import styled from 'styled-components';

import device from '../../config/device';

export default styled.div`
  height: 100vh;
  textarea {
    border: none !important;
    overflow: auto;
    outline: none !important;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;

    width: 100%;
    height: ${props => (props.open ? '90vh' : '100vh')};
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
  }

  footer {
    display: none;
    @media ${device.mobileM} {
      background: ${props => props.theme.cobalt.background};
      z-index: 1000;
      display: block;
      color: ${props => props.theme.footer.color};
      position: sticky;
      bottom: ${props => (props.open ? '0' : '1rem')};
      height: ${props => props.open && '10vh'};
      button {
        background: none;
        border: none;
        color: ${props => props.theme.footer.color};
      }
      > button {
        position: absolute;
        right: 0;
        bottom: ${props => (props.open ? '1rem' : '0')};
      }
      ul {
        margin: 0 6rem;
        border-radius: 25px;
        background: ${props => props.theme.footerBackground};
        display: ${props => (props.open ? 'flex' : 'none')};
        list-style: none;
        align-items: center;
        li {
          flex-grow: 1;
          text-align: center;
          border-right: 1px solid ${props => props.theme.footerColor};
          /* padding-bottom: 1rem; */
          a {
            display: block;
            padding: 1rem 0;
            svg {
              display: block;
              margin: 0 auto;
              color: ${props => props.theme.footerLink};
            }
          }
          &:last-child {
            border-right: none;
          }
          &.active {
            a svg {
              color: ${props => props.theme.footerLinkActive};
            }
          }
        }
      }
    }
  }
`;
