import styled from 'styled-components'
import { ToastContainer } from 'react-toastify'

export default styled(ToastContainer).attrs({
  autoClose: 3000,
})`
  .Toastify__toast-container {
    padding: 1rem;
    width: auto;
    border-radius: 25px;
  }
  .Toastify__toast {
    color: ${props => props.theme.color};
    margin-bottom: 0;
    min-height: auto;
    border-radius: 3px;
  }
  .Toastify__toast--error {
  }
  .Toastify__toast--warning {
  }
  .Toastify__toast--success {
    background: ${props => props.theme.notification.success};
  }
  .Toastify__toast-body {
    text-align: center;
  }
  .Toastify__progress-bar {
  }
`
