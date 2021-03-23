import { useState, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Modal from 'react-modal'
import { Home, FilePlus, ArrowRightCircle, X } from 'react-feather'

import Page from '../../components/Page'
import NoteList from '../../components/NoteList'
import Search from '../../components/Search'
import Note from '../../components/Note'
import NoteListSkeleton from '../../components/NoteListSkeleton'
import Footer from '../../components/styles/Footer'
import Tags from '../../components/styles/Tags'
import { getNotes } from '../../lib/api'
import useSearch from '../../lib/useSearch'

Modal.setAppElement('#__next')

export default () => {
  const [selectedTags, setSelectedTags] = useState([])
  const router = useRouter()
  const { data: notes, revalidate } = getNotes()
  const { background } = useContext(ThemeContext)
  const { search, setSearch, results, searchRef } = useSearch({
    list:
      notes?.filter(
        note =>
          selectedTags.length === 0 ||
          ((selectedTags.includes('none') &&
            (!note.tags || note.tags.length === 0 || note.tags[0] === '')) ||
            (selectedTags.includes('=') &&
              note.list &&
              note.list.length > 0 &&
              note.title.startsWith('= ')) ||
            (selectedTags.includes('[') &&
              note.table &&
              note.table.length > 0 &&
              note.title.startsWith('[ ')) ||
            (selectedTags.includes('md') &&
              note.markdown &&
              note.title.startsWith('# ')) ||
            selectedTags.some(t => note.tags.some(noteTag => noteTag === t)))
      ) || [],
    options: {
      keys: ['title', 'body', 'tags'],
    },
  })
  const note = notes?.find(n => n._id === router.query.id)
  const isNew = router.query.id === 'new'
  const modalStyles = {
    content: {
      padding: 0,
      inset: '1vh',
      top: '1vh',
      left: '1vh',
      right: '1vh',
      bottom: '1vh',
      border: 'none',
      background,
      display: 'flex',
      flexDirection: 'column',
    },
  }
  const noteList = search === '' && selectedTags.length === 0 ? notes : results
  const noteTags = [
    ...new Set(
      notes
        ?.reduce((nTags, n) => {
          nTags.push(n.tags)
          return nTags
        }, [])
        .flat()
    ),
    '=',
    '[',
    'md',
    'none',
  ].filter(tag => tag !== '')
  return (
    <Page>
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
                if (key === 'Escape') {
                  setSearch('')
                }
              }}
              searchRef={searchRef}
            />
          </>
        )}
        {notes?.length > 0 &&
          noteTags.length > 0 && (
            <Tags>
              {noteTags.map(tag => (
                <li
                  key={tag}
                  className={selectedTags.includes(tag) ? 'selected' : ''}
                >
                  <button
                    type="button"
                    onClick={() => {
                      const newSelectedTags = [...selectedTags]
                      const index = newSelectedTags.findIndex(t => t === tag)
                      if (index > -1) {
                        newSelectedTags.splice(index, 1)
                      } else newSelectedTags.push(tag)
                      setSelectedTags(newSelectedTags)
                    }}
                  >
                    {tag}
                  </button>
                </li>
              ))}
            </Tags>
          )}
        {notes ? (
          <>
            <NoteList notes={noteList} revalidate={revalidate} />
            <Footer>
              <ul>
                <li>
                  <Link href="/">
                    <a>
                      <Home />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin?id=new" as="/admin/new">
                    <a>
                      <FilePlus />
                    </a>
                  </Link>
                </li>
              </ul>
            </Footer>
          </>
        ) : (
          <NoteListSkeleton />
        )}
        <Modal
          style={modalStyles}
          isOpen={!!router.query.id}
          onRequestClose={() => router.push('/admin')}
        >
          {isNew ? (
            <Note isModal redirect="/admin" />
          ) : (
            <Note
              note={note}
              revalidate={revalidate}
              isNew={isNew}
              isModal
              redirect="/admin"
            />
          )}
          <Footer>
            <ul>
              <li>
                <Link href={`/admin/${router.query.id}`}>
                  <a>
                    <ArrowRightCircle />
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/admin">
                  <a>
                    <X />
                  </a>
                </Link>
              </li>
            </ul>
          </Footer>
        </Modal>
      </main>
    </Page>
  )
}
