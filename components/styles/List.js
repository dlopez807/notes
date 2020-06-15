import styled from 'styled-components'

export default styled.div`
  padding-bottom: 3em;
  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
  h1 {
    text-align: center;
  }
  ol,
  ul,
  div[data-rbd-droppable-id='droppable'] {
    > *:not(:last-child) {
      margin-bottom: 1rem;
    }
    li,
    > div {
      display: flex;
      border-radius: 0.25rem;
      padding: 1rem;
      background: ${props => props.theme.list.background};
      &:nth-child(even) {
        background: ${props => props.theme.list.alt.background};
      }
      svg {
        margin-left: auto;
      }
    }
  }
`
