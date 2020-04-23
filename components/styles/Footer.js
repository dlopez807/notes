import styled from 'styled-components';

import device from '../../config/device';

export default styled.footer`
  display: none;
  @media ${device.mobileM} {
    z-index: 1000;
    display: block;
    color: ${props => props.theme.footer.color};
    position: sticky;
    bottom: 1rem;
    margin-top: 1rem;
    button {
      background: none;
      border: none;
      color: ${props => props.theme.footer.color};
    }
    ul {
      margin: 0 6rem;
      border-radius: 25px;
      background: ${props => props.theme.footer.background};
      display: flex;
      list-style: none;
      align-items: center;
      li {
        flex-grow: 1;
        text-align: center;
        border-right: 1px solid ${props => props.theme.footer.color};
        /* padding-bottom: 1rem; */
        a,
        button {
          display: block;
          padding: 1rem 0;
          width: 100%;
          svg {
            display: block;
            margin: 0 auto;
            color: ${props => props.theme.footer.link.color};
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
`;
