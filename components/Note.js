import { useState } from 'react'
import Router from 'next/router'
import styled from 'styled-components'
import { Save, ArrowRightCircle, ArrowUpCircle, Settings } from 'react-feather'
import { toast } from 'react-toastify'

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
    border: 1px solid ${props => props.theme.input.background};
    &:focus {
      outline: none;
      border: 1px solid ${props => props.theme.input.color};
    }
  }
  /* textarea {
    flex: 1 0 auto;
    height: auto;
  } */
  input {
    background: ${props => props.theme.input.background};
    color: ${props => props.theme.input.color};
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
    <FooterStyles absolute={isModal} right column>
      <ul>
        {open && children}
        <li>
          <button
            type="button"
            onClick={() => {
              setOpen(!open)
            }}
          >
            <Settings />
          </button>
        </li>
      </ul>
    </FooterStyles>
  )
}

export default ({
  note: initialNote,
  revalidate,
  isModal,
  author,
  redirect,
}) => {
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
    redirect,
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
          author,
        })
        toast.success('note saved')
        if (isModal)
          Router.push(
            `${redirect}?id=${savedNote._id}`,
            `${redirect}/${savedNote._id}`
          )
        else Router.push(`${redirect}/${savedNote._id}`)
      } else {
        await updateNote({
          _id: initialNote._id,
          title,
          body,
          slug: values.slug,
          tags: values.tags,
          hook: values.hook,
        })
        toast.success('note updated')
        await revalidate()
      }
      setSubmitting(false)
    },
  })

  const { slug, tags, hook } = note
  return (
    <>
      <main>
        <Note isModal={isModal}>
          <TextArea
            ref={textarea}
            name="body"
            value={content}
            placeholder="note"
            onChange={handleTextAreaChange}
            onKeyDown={handleKeyDown}
            autoFocus
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
        </Note>
      </main>
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
                toast.success('note deployed')
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
                Router.push(redirect)
              }}
            />
          </li>
        )}
      </Footer>
    </>
  )
}
