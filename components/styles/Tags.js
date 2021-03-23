import styled from 'styled-components'

export default styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  > * {
    margin-right: 1rem;
    margin-bottom: 1rem;
  }
  li {
    button {
      padding: 0.5rem;
      border: 1px solid ${props => props.theme.tag.borderColor};
      border-radius: 0.5rem;
      background: ${props => props.theme.tag.background.default};
      color: ${props => props.theme.tag.color};
    }
    &.selected {
      button {
        background: ${props => props.theme.tag.background.selected};
        border-color: ${props => props.theme.tag.background.selected};
      }
    }
  }
`
