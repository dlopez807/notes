import Link from 'next/link'
import { X } from 'react-feather'

import Page from '../../components/Page'
import Skeleton from '../../components/styles/Skeleton'
import Markdown from '../../components/styles/Markdown'
import Footer from '../../components/styles/Footer'
import { searchNotes } from '../../lib/api'
import useUser from '../../lib/useUser'

export default () => {
  const path =
    typeof window !== 'undefined' ? window.location.pathname.slice(1) : ''
  const [, id] = path.split('/')

  const user = useUser({ redirectTo: `/login?next=/md/${id}` })
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
          <p>you are not authorized to see this markdown</p>
          <Link href="/notes">
            <a>back to notes</a>
          </Link>
        </main>
      </Page>
    )
  const { title, markdown } = note
  if (!markdown)
    return (
      <Page>
        <main>
          <p>this note is not markdown</p>
          <Link href="/notes">
            <a>back to notes</a>
          </Link>
        </main>
      </Page>
    )
  return (
    <Page title={title.replace('# ', '')}>
      <main>
        <Markdown dangerouslySetInnerHTML={{ __html: markdown }} />
      </main>
      <Footer>
        <ul>
          <li>
            <Link href="/notes">
              <a>
                <X />
              </a>
            </Link>
          </li>
        </ul>
      </Footer>
    </Page>
  )
}
