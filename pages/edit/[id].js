import Link from 'next/link'

import Page from '../../components/Page'
import Note from '../../components/Note'
import Skeleton from '../../components/styles/Skeleton'
import { getNotes } from '../../lib/api'

export default () => {
  const path =
    typeof window !== 'undefined' ? window.location.pathname.slice(1) : ''
  const [, id] = path.split('/')
  const { data: note, revalidate } = getNotes(id)
  if (!note)
    return (
      <Page full>
        <main>
          <Skeleton height="100vh" />
        </main>
      </Page>
    )
  if (!note)
    return (
      <Page full>
        <main>
          <p>you are not authorized to see this note</p>
          <Link href="/notes">
            <a>back to notes</a>
          </Link>
        </main>
      </Page>
    )
  return (
    <Page title={note.title} full>
      <Note note={note} revalidate={revalidate} redirect="/notes" />
    </Page>
  )
}
