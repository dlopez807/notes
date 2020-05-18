import { Copy, Scissors, Download } from 'react-feather'
import { toast } from 'react-toastify'

import TextArea from './styles/TextArea'
import Footer from './styles/Footer'
import useTextArea from '../lib/useTextArea'

export default () => {
  const {
    textarea,
    content,
    handleChange,
    handleKeyDown,
    copy,
    cut,
  } = useTextArea()
  return (
    <>
      <TextArea
        ref={textarea}
        placeholder="notepad"
        name="content"
        className="content"
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <Footer>
        <ul>
          <li>
            <button
              type="button"
              onClick={() => {
                toast.success('copy')
                copy()
              }}
            >
              <Copy />
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                toast.success('cut')
                cut()
              }}
            >
              <Scissors />
            </button>
          </li>
        </ul>
      </Footer>
    </>
  )
}
