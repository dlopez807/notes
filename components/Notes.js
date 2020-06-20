import Link from 'next/link'
import { useRouter } from 'next/router'
import { X, FilePlus, Search as SearchIcon } from 'react-feather'

import NoteList from './NoteList'
import NoteListSkeleton from './NoteListSkeleton'
import Search from './Search'
import Modal from './Modal'
import Tags from './styles/Tags'
import Footer from './styles/Footer'
import useUser from '../lib/useUser'
import useSearch from '../lib/useSearch'
import { searchNotes } from '../lib/api'

export default () => {
  const router = useRouter()
  const user = useUser({ redirectTo: '/login?next=/notes' })
  // const user = null
  const author = user?.email
  const { data: notes, revalidate } = searchNotes({ author })
  const {
    search,
    setSearch,
    tags,
    addTag,
    removeTag,
    results,
    searchRef,
  } = useSearch({
    list: notes || [],
    options: {
      keys: ['title', 'body', 'tags'],
    },
  })
  const note = notes?.find(n => n._id === router.query.id)
  const noteToCopy = notes?.find(n => n._id === router.query.copy)
  const copy = noteToCopy ? { ...noteToCopy } : null
  if (copy) {
    delete copy._id
    delete copy.createdAt
    delete copy.updatedAt
    copy.title = `${copy.title} copy`
  }
  const noteList = search === '' && tags.length === 0 ? notes : results
  const noteTags = [
    ...new Set(
      notes
        ?.reduce((nTags, n) => {
          nTags.push(n.tags)
          return nTags
        }, [])
        .flat()
    ),
  ]
  return (
    <>
      <main>
        {notes?.length > 0 && (
          <>
            <Search
              search={search}
              setSearch={setSearch}
              onChange={e => setSearch(e.target.value)}
              clear={() => setSearch('')}
              onKeyDown={e => {
                const { key } = e
                if (key === 'Enter') {
                  e.preventDefault()
                  addTag(e.target.value)
                  setSearch('')
                } else if (key === 'Escape') {
                  setSearch('')
                }
              }}
              searchRef={searchRef}
              list="tags"
            />
            <datalist id="tags">
              {noteTags
                .filter(nTag => !tags.some(tag => tag === nTag))
                .map(tag => (
                  <option key={tag} value={tag} />
                ))}
            </datalist>
          </>
        )}
        {tags.length > 0 && (
          <Tags>
            {tags.map(tag => (
              <li key={tag}>
                {tag}{' '}
                <button
                  type="button"
                  onClick={() => {
                    removeTag(tag)
                  }}
                >
                  <X />
                </button>
              </li>
            ))}
          </Tags>
        )}
        {user ? (
          notes ? (
            notes.length > 0 ? (
              <NoteList notes={noteList} revalidate={revalidate} />
            ) : (
              <>
                <p>you have no notes.</p>
                <Link href="/notes?id=new" as="/notes/new">
                  <a>create one</a>
                </Link>
              </>
            )
          ) : (
            <NoteListSkeleton />
          )
        ) : (
          <NoteListSkeleton />
        )}
      </main>
      <Footer>
        <ul>
          <li>
            <Link href="/notes?id=new" as="/notes/new">
              <a>
                <FilePlus />
              </a>
            </Link>
          </li>
          <li>
            <Link href="/">
              <a>
                <X />
              </a>
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                searchRef.current.focus()
              }}
            >
              <SearchIcon />
            </button>
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
