import styled from 'styled-components'
import device from '../../config/device'

export default styled.ul`
  list-style: none;
  > li {
    margin-bottom: 1rem;
    padding: 1rem;
    border: 1px solid ${props => props.theme.noteListItem.border};
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    > * {
      margin-bottom: 1rem;
      &:last-child {
        margin-bottom: 0;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    &.skeleton {
      padding: 0;
    }
    a,
    button {
      display: flex;
      align-items: center;
    }
    a {
      color: ${props => props.theme.color};
    }
    button {
      background: none;
      border: none;
      color: ${props => props.theme.color};
    }
    .tags {
      list-style: none;
    }
    .commands {
      display: flex;
      align-items: center;
      > * {
        margin-right: 2rem;
        padding: 0;
      }
    }
    .author {
      display: flex;
      input,
      button {
        border: 1px solid ${props => props.theme.color};
        padding: 0.75rem;
      }
      input {
        width: 100%;
        background: ${props => props.theme.background};
        color: ${props => props.theme.color};
      }
      button {
        background: ${props => props.theme.form.button.background};
        color: ${props => props.theme.form.button.color};
        &[disabled] {
          background: ${props => props.theme.form.button.disabled.background};
          color: ${props => props.theme.form.button.disabled.color};
        }
      }
    }
  }
  @media ${device.tablet} {
    width: 50vh;
    margin: 0 auto;
  }
`
