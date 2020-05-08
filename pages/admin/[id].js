import Note from '../../components/Note'
import { getNotes } from '../../lib/api'

export default () => {
  const path =
    typeof window !== 'undefined' ? window.location.pathname.slice(1) : ''
  const [, id] = path.split('/')
  const { data, revalidate } = getNotes(id)
  if (!data) return <div>loading</div>
  const note = data || {
    title: '',
    body: '',
    slug: '',
    tags: [],
    hook: '',
  }
  return <Note note={note} revalidate={revalidate} />
}
