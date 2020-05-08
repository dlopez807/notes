import { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Modal from 'react-modal'
import { Home, Edit, FilePlus, ArrowRightCircle, X } from 'react-feather'

import Note from '../../components/Note'
import Footer from '../../components/styles/Footer'
import { getNotes } from '../../lib/api'

Modal.setAppElement('#__next')

const NoteStyles = styled.li`
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
  input,
  textarea {
    width: 100%;
    border: none;
  }
  textarea {
    height: 25vh;
  }
  input {
    background: ${props => props.theme.background};
    color: ${props => props.theme.color};
  }
  button {
    background: none;
    border: none;
    color: ${props => props.theme.color};
  }
  a {
    color: ${props => props.theme.color};
  }
`

export default () => {
  const router = useRouter()
  // const [theme] = useLocalStorage('theme', '');
  const { data: notes, revalidate } = getNotes()
  const { background } = useContext(ThemeContext)
  if (!notes) return <div>loading</div>
  const note = notes.find(n => n._id === router.query.id)
  const isNew = router.query.id === 'new'
  const modalStyles = {
    content: {
      padding: 0,
      inset: '1vh',
      top: '1vh',
      left: '1vh',
      right: '1vh',
      bottom: '1vh',
      border: 'none',
      background,
      display: 'flex',
      flexDirection: 'column',
    },
  }
  return (
    <>
      <ul>
        {notes.map(({ _id, title, slug }) => (
          <NoteStyles key={_id}>
            <h2 data-id={_id}>{title}</h2>
            <Link href={`/admin?id=${_id}`} as={`/admin/${_id}`}>
              <a>
                <Edit />
              </a>
            </Link>
            {slug && (
              <Link href={`/${slug}`}>
                <a>
                  <ArrowRightCircle />
                </a>
              </Link>
            )}
          </NoteStyles>
        ))}
      </ul>
      <Footer>
        <ul>
          <li>
            <Link href="/">
              <a>
                <Home />
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin?id=new" as="/admin/new">
              <a>
                <FilePlus />
              </a>
            </Link>
          </li>
        </ul>
      </Footer>
      <Modal
        style={modalStyles}
        isOpen={!!router.query.id}
        onRequestClose={() => router.push('/admin')}
      >
        {isNew ? (
          <Note isModal />
        ) : (
          <Note note={note} revalidate={revalidate} isNew={isNew} isModal />
        )}
        <Footer>
          <ul>
            <li>
              <Link href={`/admin/${router.query.id}`}>
                <a>
                  <ArrowRightCircle />
                </a>
              </Link>
            </li>
            <li>
              <Link href="/admin">
                <a>
                  <X />
                </a>
              </Link>
            </li>
          </ul>
        </Footer>
      </Modal>
    </>
  )
}
