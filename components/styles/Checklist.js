import styled from 'styled-components'

import device from '../../config/device'

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
      > *:not(:last-child) {
        margin-right: 1rem;
      }
      display: flex;
      align-items: center;
      border-radius: 0.25rem;
      padding: 1rem;
      background: ${props => props.theme.checklist.background};
      &.duplicate {
        border-left: 5px solid
          ${props => props.theme.checklist.duplicate.border};
      }
      input[type='text'] {
        flex-grow: 1;
        border: none;
        color: ${props => props.theme.color};
        background: ${props => props.theme.checklist.background};
        &[readOnly] {
          cursor: auto;
          pointer-events: none;
        }
        &.checked {
          color: ${props => props.theme.form.text.disabled.color};
          text-decoration: line-through;
        }
      }
      input[type='checkbox'] {
        transform: scale(1.25);
      }
      svg {
        height: 2rem;
      }
      button {
        border: none;
        color: ${props => props.theme.color};
        background: transparent;
        display: flex;
        align-items: center;
        padding: 0;
      }
    }
  }
  @media ${device.tablet} {
    width: 50vh;
    margin: 0 auto;
  }
`
