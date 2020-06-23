import Link from 'next/link'

import Page from '../../components/Page'
import List from '../../components/List'
import Skeleton from '../../components/styles/Skeleton'
import { searchNotes } from '../../lib/api'
import useUser from '../../lib/useUser'

export default () => {
  const path =
    typeof window !== 'undefined' ? window.location.pathname.slice(1) : ''
  const [, id] = path.split('/')

  const user = useUser({ redirectTo: `/login?next=/lists/${id}` })
  const author = user?.email
  const { data: notes } = searchNotes({ author, _id: id })
  if (!notes)
    return (
      <Page full>
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
          <p>you are not authorized to see this list</p>
          <Link href="/notes">
            <a>back to notes</a>
          </Link>
        </main>
      </Page>
    )
  if (!note.list)
    return (
      <Page>
        <main>
          <p>this note is not a list</p>
          <Link href="/notes">
            <a>back to notes</a>
          </Link>
        </main>
      </Page>
    )
  return (
    <Page title={note.title.replace('= ', '')}>
      <List note={note} />
    </Page>
  )
}
