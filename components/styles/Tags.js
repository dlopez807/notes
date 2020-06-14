import styled from 'styled-components'

export default styled.ul`
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
`
