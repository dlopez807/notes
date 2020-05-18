import React from 'react'

import { render, fireEvent } from 'test-utils'
import Note from '../components/Note'

it('renders note component', () => {
  const { getByPlaceholderText } = render(<Note />)
  const note = getByPlaceholderText('note')
  expect(note).toBeInTheDocument()
  const slug = getByPlaceholderText('slug')
  expect(slug).toBeInTheDocument()
  const tags = getByPlaceholderText('tags')
  expect(tags).toBeInTheDocument()
  const hook = getByPlaceholderText('hook')
  expect(hook).toBeInTheDocument()
})

it('allows input', () => {
  const { getByPlaceholderText } = render(<Note />)
  const note = getByPlaceholderText('note')
  const text = 'text'
  fireEvent.change(note, { target: { value: text } })
  expect(note.value).toBe(text)
})

it('performs clear command', () => {
  const { getByPlaceholderText } = render(<Note />)
  const note = getByPlaceholderText('note')
  const text = 'hello !c'
  fireEvent.change(note, { target: { value: text } })
  expect(note.value).toBe(text)
  fireEvent.keyDown(note, { key: ' ' })
  expect(note.value).toBe('')
})

it('performs q command', () => {
  const { getByPlaceholderText } = render(<Note />)
  const note = getByPlaceholderText('note')
  const q = `Scramble:
// inspection
// cross
// F2L1
// F2L2
// F2L3
// F2L4
// OLL
// PLL
// AUF`
  const text = '!q'
  fireEvent.change(note, { target: { value: text } })
  fireEvent.keyDown(note, { key: ' ' })
  expect(note.value).toBe(q)
})

it('displays empty note', () => {
  const emptyNote = {
    title: '',
    body: '',
    slug: '',
    tags: [],
    hook: '',
  }
  const { getByPlaceholderText } = render(<Note note={emptyNote} />)
  const note = getByPlaceholderText('note')
  expect(note).toBeInTheDocument()
  const slug = getByPlaceholderText('slug')
  expect(slug).toBeInTheDocument()
  const tags = getByPlaceholderText('tags')
  expect(tags).toBeInTheDocument()
  const hook = getByPlaceholderText('hook')
  expect(hook).toBeInTheDocument()
})

it('displays note fields', () => {
  const sampleNote = {
    title: 'hello there',
    body: 'angel from my nightmare',
    slug: '',
    tags: ['music', 'lyrics'],
    hook: 'https://deployhook.com',
  }
  const { getByPlaceholderText } = render(<Note note={sampleNote} />)
  const note = getByPlaceholderText('note')
  expect(note.value).toBe(`${sampleNote.title}\n${sampleNote.body}`)
  const slug = getByPlaceholderText('slug')
  expect(slug.value).toBe(sampleNote.slug)
  const tags = getByPlaceholderText('tags')
  expect(tags.value).toBe(sampleNote.tags.join(' '))
  const hook = getByPlaceholderText('hook')
  expect(hook.value).toBe(sampleNote.hook)
})
