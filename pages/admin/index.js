import { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Modal from 'react-modal'
import { Home, FilePlus, ArrowRightCircle, X } from 'react-feather'

import Page from '../../components/Page'
import NoteList from '../../components/NoteList'
import Note from '../../components/Note'
import Skeleton from '../../components/styles/Skeleton'
import Footer from '../../components/styles/Footer'
import { getNotes } from '../../lib/api'

Modal.setAppElement('#__next')

export default () => {
  const router = useRouter()
  const { data: notes, revalidate: rev } = getNotes()
  const revalidate = () => {
    rev()
    console.log('revalidate')
  }
  const { background } = useContext(ThemeContext)
  const note = notes?.find(n => n._id === router.query.id)
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
    <Page>
      <main>
        {notes ? (
          <>
            <NoteList notes={notes} revalidate={revalidate} />
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
          </>
        ) : (
          <Skeleton height="100vh" />
        )}
        <Modal
          style={modalStyles}
          isOpen={!!router.query.id}
          onRequestClose={() => router.push('/admin')}
        >
          {isNew ? (
            <Note isModal redirect="/admin" />
          ) : (
            <Note
              note={note}
              revalidate={revalidate}
              isNew={isNew}
              isModal
              redirect="/admin"
            />
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
      </main>
    </Page>
  )
}
