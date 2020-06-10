import styled from 'styled-components'
import device from '../../config/device'

export default styled.div`
  > * {
    margin-bottom: 1rem;
  }
  padding: 1rem;
  header {
    display: flex;
    align-items: center;
    > * {
      margin-right: 1rem;
    }
    h1 {
      svg {
        color: ${props => props.theme.logo.color};
      }
      span {
        display: none;
      }
    }
    a {
      color: ${props => props.theme.color};
      display: flex;
      align-items: center;
    }
  }
  .search {
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
  }
  .tags {
    display: flex;
    list-style: none;
    > * {
      margin-right: 1rem;
    }
    li {
      display: flex;
      align-items: center;
      .tag {
        /* display: flex; */
      }
      button {
        display: flex;
        border: none;
        background: transparent;
        color: ${props => props.theme.form.button.color};
      }
    }
  }
  @media ${device.tablet} {
    width: 100vh;
    margin: 0 auto;
    header {
      h1 {
        flex-grow: 1;
        span {
          display: inline;
        }
      }
    }
  }
`
