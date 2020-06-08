import Page from '../../components/Page'
import Note from '../../components/Note'
import Skeleton from '../../components/styles/Skeleton'
import { getNotes } from '../../lib/api'

export default () => {
  const path =
    typeof window !== 'undefined' ? window.location.pathname.slice(1) : ''
  const [, id] = path.split('/')
  const { data, revalidate } = getNotes(id)
  const note = data || {
    title: '',
    body: '',
    slug: '',
    tags: [],
    hook: '',
  }
  return (
    <Page>
      <main>
        {data ? (
          <Note note={note} revalidate={revalidate} redirect="/admin" />
        ) : (
          <Skeleton height="100vh" />
        )}
      </main>
    </Page>
  )
}
