import styled from 'styled-components';

export default styled.footer`
  display: block;
  color: ${props => props.theme.footer.color};
  bottom: 1rem;
  position: fixed;
  width: 100%;
  ul {
    margin: 0 6rem;
    border-radius: 25px;
    background: ${props => props.theme.footer.background};
    display: flex;
    list-style: none;
    align-items: center;
    box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
    li {
      flex-grow: 1;
      text-align: center;
      border-right: 1px solid ${props => props.theme.footer.color};
      a,
      button {
        display: block;
        padding: 1rem 0;
        width: 100%;
        background: none;
        border: none;
        color: ${props => props.theme.footer.color};
        svg {
          display: block;
          margin: 0 auto;
          color: ${props => props.theme.footer.link.color};
        }
      }
      &:last-child {
        border-right: none;
      }
      /* &.active {
        a svg {
          color: ${props => props.theme.footerLinkActive};
        }
      } */
    }
  }
`;
