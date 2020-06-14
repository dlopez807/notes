import { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Modal from 'react-modal'
import { ArrowRightCircle, X } from 'react-feather'

import Note from './Note'
import Footer from './styles/Footer'

Modal.setAppElement('#__next')

export default ({ note, copy, revalidate, author, redirect }) => {
  const router = useRouter()
  const { pathname } = router
  const { background } = useContext(ThemeContext)
  const isNew = router.query.id === 'new'
  const modalStyles = {
    overlay: {
      background,
    },
    content: {
      padding: 0,
      inset: '1vh',
      top: '1vh',
      left: '1vh',
      right: '1vh',
      bottom: '1vh',
      border: 'none',
      display: 'flex',
      flexDirection: 'column',
    },
  }
  return (
    <Modal
      htmlOpenClassName="ReactModal__Html--open"
      style={modalStyles}
      isOpen={!!router.query.id || !!router.query.copy}
      onRequestClose={async () => {
        // await revalidate()
        router.push(pathname)
      }}
    >
      {copy ? (
        <Note isModal note={copy} author={author} redirect={redirect} />
      ) : isNew ? (
        <Note isModal author={author} redirect={redirect} />
      ) : (
        <Note
          note={note}
          revalidate={revalidate}
          isNew={isNew}
          isModal
          author={author}
          redirect={redirect}
        />
      )}
      <Footer>
        <ul>
          <li>
            <Link href={`${pathname}/${router.query.id}`}>
              <a>
                <ArrowRightCircle />
              </a>
            </Link>
          </li>
          <li>
            <Link href={pathname}>
              <a>
                <X />
              </a>
            </Link>
          </li>
        </ul>
      </Footer>
    </Modal>
  )
}
