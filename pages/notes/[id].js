import Link from 'next/link'

import Page from '../../components/Page'
import Note from '../../components/Note'
import Skeleton from '../../components/styles/Skeleton'
import { searchNotes } from '../../lib/api'
import useUser from '../../lib/useUser'

export default () => {
  const path =
    typeof window !== 'undefined' ? window.location.pathname.slice(1) : ''
  const [, id] = path.split('/')
  const user = useUser({ redirectTo: `/login?next=/notes/${id}` })
  const author = user?.email
  const { data: notes, revalidate } = searchNotes({ author, _id: id })
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
          <p>you are not authorized to see this note</p>
          <Link href="/notes">
            <a>back to notes</a>
          </Link>
        </main>
      </Page>
    )
  return (
    <Page>
      <main>
        <Note note={note} revalidate={revalidate} redirect="/notes" />
      </main>
    </Page>
  )
}
