import { useState, useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import Modal from 'react-modal';
import { Home, Edit, FilePlus, ArrowRightCircle, X } from 'react-feather';

import Delete from '../../components/Delete';
import Note from '../../components/Note';
import Footer from '../../components/styles/Footer';
import TextArea from '../../components/styles/TextArea';
import { getNotes, saveNote, updateNote, deployNote, deleteNote } from '../../lib/api';
import useLocalStorage from '../../lib/useLocalStorage';
import useForm from '../../lib/useForm';

Modal.setAppElement('#__next');

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
    background: ${props => props.theme.background};
    color: ${props => props.theme.color};
  }
  button {
    background: none;
    border: none;
    color: ${props => props.theme.color};
  }
  a {
    color: ${props => props.theme.color};
  }
`;

const Note2 = ({ note: initialNote, theme, revalidate, isNew }) => {
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

const Note1 = ({ note: { _id, title, slug } }) => (
  <NoteStyles>
    <h2 data-id={_id}>{title}</h2>
    <Link href={`/admin/${_id}`}>
      <a>
        <Edit />
      </a>
    </Link>
    {slug && (
      <Link href={`/${slug}`}>
        <a>
          <ArrowRightCircle />
        </a>
      </Link>
    )}
  </NoteStyles>
);

export default () => {
  const router = useRouter();
  // const [theme] = useLocalStorage('theme', '');
  const { data: notes, revalidate } = getNotes();
  const { background } = useContext(ThemeContext);
  if (!notes) return <div>loading</div>;
  // const sortedNotes = notes.sort((a, b) => moment(b.updatedAt) - moment(a.updatedAt));
  const note = notes.find(n => n._id === router.query.id);
  const isNew = router.query.id === 'new';
  const modalStyles = {
    // content: {
    //   top: '50%',
    //   left: '50%',
    //   right: 'auto',
    //   bottom: 'auto',
    //   marginRight: '-50%',
    //   transform: 'translate(-50%, -50%)'
    // }
    overlay: {
      // inset: '5vh',
    },
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
  };
  return (
    <>
      <ul>
        {/* <NoteStyles>
          <Link href="/admin?id=new" as="/admin/new">
            <a>
              <FilePlus />
            </a>
          </Link>
        </NoteStyles> */}
        {notes.map(({ _id, title, slug }) => (
          <NoteStyles key={_id}>
            <h2 data-id={_id}>{title}</h2>
            <Link href={`/admin?id=${_id}`} as={`/admin/${_id}`}>
              <a>
                <Edit />
              </a>
            </Link>
            {slug && (
              <Link href={`/${slug}`}>
                <a>
                  <ArrowRightCircle />
                </a>
              </Link>
            )}
          </NoteStyles>
        ))}
      </ul>
      {/* <ul>
        <Note key="new" isNew theme={theme} revalidate={revalidate} />
        {notes.map(note => (
          <Note key={note._id} note={note} theme={theme} revalidate={revalidate} />
        ))}
      </ul> */}
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
      <Modal style={modalStyles} isOpen={!!router.query.id} onRequestClose={() => router.push('/admin')}>
        {isNew ? <Note isModal /> : <Note note={note} revalidate={revalidate} isNew={isNew} isModal />}
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
    </>
  );
};
