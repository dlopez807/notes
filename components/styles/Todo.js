import styled from 'styled-components'

const Search = styled.input`
  width: 100%;
`

export { Search }

export default styled.ul`
  li {
    background: #fff;
    display: flex;
    align-items: center;
    input,
    button {
      border: none;
      background: #fff;
    }
    input {
      padding: 1rem;
      &[type='text'] {
        flex-grow: 1;
        &[readOnly] {
          color: lightgray;
          cursor: auto;
          pointer-events: none;
        }
        &:focus {
          outline: none;
        }
      }
      &[type='checkbox'] {
        transform: scale(1.5);
        margin: 0 1rem;
      }
    }
    button {
      padding: 1rem;
    }
    &:nth-child(even) {
      background: #eee;
      input[type='text'] {
        background: #eee;
      }
      button {
        background: #eee;
      }
    }
    &:last-child {
      position: sticky;
      bottom: 1rem;
      margin: 0 6rem;
      margin-top: 1rem;
      border-radius: 25px;
      background: ${props => props.theme.footer.background};
      button.add {
        border-radius: 25px;
        width: 100vw;
        background: #193549;
        color: #fff;
      }
    }
  }
`
