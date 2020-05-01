import { useState } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import { Save, ArrowRightCircle, ArrowUpCircle, Settings } from 'react-feather';

import Delete from './Delete';
import TextArea from './styles/TextArea';
import FooterStyles from './styles/Footer';
import { saveNote, updateNote, deployNote, deleteNote } from '../lib/api';
import useForm from '../lib/useForm';

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
    /* height: 25vh; */
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
`;

const Footer = ({ isModal, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <FooterStyles absolute={isModal} right>
      {open ? (
        <ul>
          {children}
          <li>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
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
              setOpen(true);
            }}
            className="open"
          >
            <Settings />
          </button>
        )}
    </FooterStyles>
  );
};

export default ({ note: initialNote, theme, revalidate, isModal }) => {
  const initialValues = {
    title: initialNote?.title ?? '',
    body: initialNote?.body ?? '',
    slug: initialNote?.slug ?? '',
    tags: initialNote?.tags.join(' ') ?? '',
    hook: initialNote?.hook ?? '',
  };
  const { values: note, handleChange, handleSubmit, isSubmitting, dirty } = useForm({
    initialValues,
    onSubmit: async (values, { setSubmitting }) => {
      if (!initialNote?._id) {
        const { data: savedNote } = await saveNote({
          title: values.title,
          body: values.body,
          slug: values.slug,
          tags: values.tags,
        });
        if (isModal) Router.push(`/admin?id=${savedNote._id}`, `/admin/${savedNote._id}`);
        else Router.push(`/admin/${savedNote._id}`);
      } else {
        await updateNote({
          _id: initialNote._id,
          title: values.title,
          body: values.body,
          slug: values.slug,
          tags: values.tags,
          hook: values.hook,
        });
        await revalidate();
      }
      setSubmitting(false);
    },
  });

  const { title, body, slug, tags, hook } = note;

  return (
    <Note isModal={isModal}>
      <h2>
        <input name="title" value={title} placeholder="title" onChange={handleChange} />
      </h2>
      <TextArea name="body" value={body} placeholder="body" onChange={handleChange} />
      <input name="slug" value={slug} placeholder="slug" onChange={handleChange} />
      <input name="tags" value={tags} placeholder="tags" onChange={handleChange} />
      <input name="hook" value={hook} placeholder="hook" onChange={handleChange} />
      <Footer isModal={isModal}>
        <li>
          <button type="button" onClick={handleSubmit} disabled={!dirty || isSubmitting}>
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
                console.log({ deployId: initialNote._id });
                const res = await deployNote(initialNote._id);
                console.log({ res });
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
                await deleteNote(initialNote._id);
                await revalidate();
                Router.push('/admin');
              }}
            />
          </li>
        )}
      </Footer>
    </Note>
  );
};
