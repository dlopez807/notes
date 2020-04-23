import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Router from 'next/router';
import { Home, Edit, FilePlus, ArrowRightCircle } from 'react-feather';

import Delete from '../components/Delete';
import Footer from '../components/styles/Footer';
import TextArea from '../components/styles/TextArea';
import { getNotes, saveNote, updateNote, deployNote, deleteNote } from '../lib/api';
import useLocalStorage from '../lib/useLocalStorage';
import useForm from '../lib/useForm';

const NoteStyles = styled.li`
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
  input,
  textarea {
    width: 100%;
    border: none;
  }
  textarea {
    height: 25vh;
  }
  input {
    &.cobalt {
      background: ${props => props.theme.cobalt.background};
      color: ${props => props.theme.cobalt.color};
    }
  }
  button {
    background: none;
    border: none;
  }
`;

const Note = ({ note: initialNote, theme, revalidate, isNew }) => {
  const [edit, setEdit] = useState(false);
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
      if (isNew)
        await saveNote({
          title: values.title,
          body: values.body,
          slug: values.slug,
          tags: values.tags,
        });
      else
        await updateNote({
          _id: initialNote._id,
          title: values.title,
          body: values.body,
          slug: values.slug,
          tags: values.tags,
          hook: values.hook,
        });
      await revalidate();
      setSubmitting(false);
    },
  });

  const { title, body, slug, tags, hook } = note;

  if (isNew)
    return (
      <NoteStyles>
        <h2>
          <button type="button" onClick={() => setEdit(true)}>
            <FilePlus />
          </button>
        </h2>
      </NoteStyles>
    );
  if (!edit)
    return (
      <NoteStyles>
        <h2 data-id={initialNote._id}>{title}</h2>
        <button type="button" onClick={() => setEdit(true)}>
          <Edit />
        </button>
        {slug && (
          <button type="button" onClick={() => Router.push(`/${slug}`)}>
            <ArrowRightCircle />
          </button>
        )}
      </NoteStyles>
    );
  return (
    <NoteStyles>
      <h2>
        {edit ? (
          <input name="title" value={title} placeholder="title" onChange={handleChange} className={theme} />
        ) : (
            <button type="button" onClick={() => setEdit(true)}>
              {isNew ? '+' : `${title}${slug && ` | /${slug}`}${tags && ` | ${tags}`}`}
            </button>
          )}
      </h2>
      {edit && (
        <>
          <TextArea name="body" value={body} placeholder="body" onChange={handleChange} className={theme} />
          <input name="slug" value={slug} placeholder="slug" onChange={handleChange} className={theme} />
          <input name="tags" value={tags} placeholder="tags" onChange={handleChange} className={theme} />
          <input name="hook" value={hook} placeholder="hook" onChange={handleChange} className={theme} />
          <button type="button" onClick={handleSubmit} disabled={!dirty || isSubmitting}>
            sav
            {isSubmitting ? 'ing' : 'e'}
          </button>
          {slug && (
            <button type="button" onClick={() => Router.push(`/${slug}`)}>
              go
            </button>
          )}
          {hook && (
            <button type="button" onClick={() => deployNote(initialNote._id)} disabled={dirty}>
              deploy
            </button>
          )}
          <button type="button" onClick={() => setEdit(false)}>
            cancel
          </button>
          <Delete
            handleDelete={async () => {
              await deleteNote(initialNote._id);
              await revalidate();
            }}
          />
        </>
      )}
    </NoteStyles>
  );
};

export default () => {
  const [theme] = useLocalStorage('theme', '');
  const { data, revalidate } = getNotes();
  if (!data) return <div>loading</div>;
  const { notes } = data;
  // const sortedNotes = notes.sort((a, b) => moment(b.updatedAt) - moment(a.updatedAt));
  return (
    <>
      <ul>
        <Note key="new" isNew theme={theme} revalidate={revalidate} />
        {notes.map(note => (
          <Note key={note._id} note={note} theme={theme} revalidate={revalidate} />
        ))}
      </ul>
      <Footer>
        <ul>
          <li>
            <Link href="/">
              <a>
                <Home />
              </a>
            </Link>
          </li>
        </ul>
      </Footer>
    </>
  );
};
