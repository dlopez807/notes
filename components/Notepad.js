import Link from 'next/link'
import { List, Scissors } from 'react-feather'
import { toast } from 'react-toastify'

import TextArea from './styles/TextArea'
import Footer from './styles/Footer'
import useTextArea from '../lib/useTextArea'

export default () => {
  const { textarea, content, handleChange, handleKeyDown, cut } = useTextArea()
  return (
    <>
      <main>
        <TextArea
          ref={textarea}
          placeholder="notepad"
          name="content"
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </main>
      <Footer>
        <ul>
          <li>
            <Link href="/notes">
              <a>
                <List />
              </a>
            </Link>
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
