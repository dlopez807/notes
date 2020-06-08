import { useRouter } from 'next/router'
import Link from 'next/link'

import Page from '../../components/Page'
import Note from '../../components/Note'
import Skeleton from '../../components/styles/Skeleton'
import useUser from '../../lib/useUser'
import { searchNotes } from '../../lib/api'

export default () => {
  const router = useRouter()
  const { query } = router
  const id = query?.id
  const user = useUser({ redirectTo: '/login?next=/notes/new' })
  const author = user?.email
  const { data: notes } = id ? searchNotes({ author, _id: id }) : {}
  if (id) {
    if (!notes)
      return (
        <Page>
          <main>
            <Skeleton height="100vh" />
          </main>
        </Page>
      )
    const note = notes[0]
    if (!note)
      return (
        <Page>
          <main>
            <p>you are not authorized to copy this note</p>
            <Link href="/notes">
              <a>back to notes</a>
            </Link>
          </main>
        </Page>
      )
    delete note._id
    delete note.createdAt
    delete note.updateAt
    note.title = `${note.title} copy`
    return (
      <Page>
        <main>
          <Note note={note} author={author} redirect="/notes" />
        </main>
      </Page>
    )
  }
  return (
    <Page>
      <main>
        {user ? (
          <Note author={author} redirect="/notes" />
        ) : (
          <Skeleton height="100vh" />
        )}
      </main>
    </Page>
  )
}
