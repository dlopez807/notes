import { array } from 'prop-types';

import Notes from '../components/Notes';
import { fetchNotes } from '../lib/api';

const NotesPage = ({ notes }) => <Notes notes={notes} />;

NotesPage.propTypes = {
  notes: array.isRequired,
};

NotesPage.getInitialProps = async () => {
  const notes = await fetchNotes();
  return { notes };
};

export default NotesPage;
