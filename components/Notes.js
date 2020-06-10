import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  X,
  LogOut,
  FilePlus,
  Search as SearchIcon,
  Triangle,
} from 'react-feather'

import NoteList from './NoteList'
import NoteListSkeleton from './NoteListSkeleton'
import Search from './Search'
import Modal from './Modal'
import Notes from './styles/Notes'
import Footer from './styles/Footer'
import useUser from '../lib/useUser'
import useSearch from '../lib/useSearch'
import { searchNotes } from '../lib/api'

export default () => {
  const router = useRouter()
  const user = useUser({ redirectTo: '/login?next=/notes' })
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
                <ul className="tags">
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
                </ul>
                <NoteList notes={noteList} revalidate={revalidate} />
              </>
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
