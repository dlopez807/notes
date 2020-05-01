import Note from '../../components/Note';
import { getNotes } from '../../lib/api';

export default () => {
  const path = typeof window !== 'undefined' ? window.location.pathname.slice(1) : '';
  const [, id] = path.split('/');
  const { data, revalidate } = getNotes(id);
  // const isNew = !note;
  // if (id === 'new') return <Note isNew revalidate={revalidate} />;
  if (!data) return <div>loading</div>;
  // console.log({ id, note, isNew });
  const note = data || {
    title: '',
    body: '',
    slug: '',
    tags: [],
    hook: '',
  };
  return <Note note={note} revalidate={revalidate} />;
  // return <Note id={id} />;
};
