import { useState } from 'react'
import Router from 'next/router'
import styled from 'styled-components'
import { Save, ArrowRightCircle, ArrowUpCircle, Settings } from 'react-feather'

import Delete from './Delete'
import TextArea from './styles/TextArea'
import FooterStyles from './styles/Footer'
import { saveNote, updateNote, deployNote, deleteNote } from '../lib/api'
import useForm from '../lib/useForm'
import useTextArea from '../lib/useTextArea'

const Note = styled.div`
  display: flex;
  flex-direction: column;
  height: ${props => (props.isModal ? '98vh' : '100vh')};
  background: ${props => props.theme.background};
  color: ${props => props.theme.color};
  position: relative;
  input,
  textarea {
    width: 100%;
    border: none;
  }
  textarea {
    flex: 1 0 auto;
    height: auto;
  }
  input {
    background: ${props => props.theme.background};
    color: ${props => props.theme.color};
    padding: 5px;
  }
  button {
    background: none;
    border: none;
    color: ${props => props.theme.color};
  }
`

const Footer = ({ isModal, children }) => {
  const [open, setOpen] = useState(false)
  return (
    <FooterStyles absolute={isModal} right>
      {open ? (
        <ul>
          {children}
          <li>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
              }}
            >
              <Settings />
            </button>
          </li>
        </ul>
      ) : (
        <button
          type="button"
          onClick={() => {
            setOpen(true)
          }}
          className="open"
        >
          <Settings />
        </button>
      )}
    </FooterStyles>
  )
}

export default ({ note: initialNote, revalidate, isModal }) => {
  const initialValues = {
    slug: initialNote?.slug ?? '',
    tags: initialNote?.tags.join(' ') ?? '',
    hook: initialNote?.hook ?? '',
  }
  const initialContent = `${initialNote ? initialNote.title : ''}${
    initialNote ? `\n${initialNote.body}` : ''
  }`
  const {
    textarea,
    content,
    handleChange: handleTextAreaChange,
    handleKeyDown,
    dirty: dirtyTextArea,
  } = useTextArea({
    initialContent,
    noteId: initialNote?._id,
  })
  const {
    values: note,
    handleChange,
    handleSubmit,
    isSubmitting,
    dirty,
  } = useForm({
    initialValues,
    onSubmit: async (values, { setSubmitting }) => {
      const [title, ...bodyArray] = content.split('\n')
      const body = bodyArray.join('\n')
      if (!initialNote?._id) {
        const { data: savedNote } = await saveNote({
          title,
          body,
          slug: values.slug,
          tags: values.tags,
        })
        if (isModal)
          Router.push(`/admin?id=${savedNote._id}`, `/admin/${savedNote._id}`)
        else Router.push(`/admin/${savedNote._id}`)
      } else {
        await updateNote({
          _id: initialNote._id,
          title,
          body,
          slug: values.slug,
          tags: values.tags,
          hook: values.hook,
        })
        await revalidate()
      }
      setSubmitting(false)
    },
  })

  const { slug, tags, hook } = note

  return (
    <Note isModal={isModal}>
      <TextArea
        ref={textarea}
        name="body"
        value={content}
        placeholder="note"
        onChange={handleTextAreaChange}
        onKeyDown={handleKeyDown}
      />
      <input
        name="slug"
        value={slug}
        placeholder="slug"
        onChange={handleChange}
      />
      <input
        name="tags"
        value={tags}
        placeholder="tags"
        onChange={handleChange}
      />
      <input
        name="hook"
        value={hook}
        placeholder="hook"
        onChange={handleChange}
      />
      <Footer isModal={isModal}>
        <li>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={(!dirty && !dirtyTextArea) || isSubmitting}
          >
            <Save />
          </button>
        </li>
        {slug && (
          <li>
            <button type="button" onClick={() => Router.push(`/${slug}`)}>
              <ArrowRightCircle />
            </button>
          </li>
        )}
        {hook && (
          <li>
            <button
              type="button"
              onClick={async () => {
                const res = await deployNote(initialNote._id)
                console.log({ deployRes: res })
              }}
              disabled={dirty}
            >
              <ArrowUpCircle />
            </button>
          </li>
        )}
        {initialNote?._id && (
          <li>
            <Delete
              handleDelete={async () => {
                await deleteNote(initialNote._id)
                await revalidate()
                Router.push('/admin')
              }}
            />
          </li>
        )}
      </Footer>
    </Note>
  )
}
