import Link from 'next/link'
import { useRouter } from 'next/router'
import { X, LogOut, FilePlus, Triangle } from 'react-feather'

import NoteList from './NoteList'
import NoteListSkeleton from './NoteListSkeleton'
import Modal from './Modal'
import Notes from './styles/Notes'
import Footer from './styles/Footer'
import useUser from '../lib/useUser'
import { searchNotes } from '../lib/api'

export default () => {
  const router = useRouter()
  const user = useUser({ redirectTo: '/login?next=/notes' })
  const author = user?.email
  const { data: notes, revalidate } = searchNotes({ author })
  const note = notes?.find(n => n._id === router.query.id)
  const noteToCopy = notes?.find(n => n._id === router.query.copy)
  const copy = noteToCopy ? { ...noteToCopy } : null
  if (copy) {
    delete copy._id
    delete copy.createdAt
    delete copy.updateAt
    copy.title = `${copy.title} copy`
  }
  return (
    <>
      <Notes>
        <header>
          <h1>
            <Triangle />
            <span> my notes</span>
          </h1>
          {user?.email && (
            <>
              <span>{user.email}</span>
              <Link href="/api/auth/logout">
                <a>
                  <LogOut />
                </a>
              </Link>
            </>
          )}
        </header>
        {user ? (
          notes ? (
            notes.length > 0 ? (
              <NoteList notes={notes} revalidate={revalidate} />
            ) : (
              <p>
                you have no notes.{' '}
                <Link href="/notes?id=new" as="/notes/new">
                  <a>create one</a>
                </Link>
              </p>
            )
          ) : (
            <NoteListSkeleton />
          )
        ) : (
          <NoteListSkeleton />
        )}
      </Notes>
      <Footer>
        <ul>
          <li>
            <Link href="/">
              <a>
                <X />
              </a>
            </Link>
          </li>
          <li>
            <Link href="/notes?id=new" as="/notes/new">
              <a>
                <FilePlus />
              </a>
            </Link>
          </li>
        </ul>
      </Footer>
      <Modal
        note={note}
        copy={copy}
        revalidate={revalidate}
        author={author}
        redirect="/notes"
      />
    </>
  )
}
