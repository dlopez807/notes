import Notes from '../components/Notes';
import { fetchNotes } from '../lib/api';

const NotesPage = () => <Notes />;

// NotesPage.getInitialProps = async () => {
//   const notes = await fetchNotes();
//   return { notes };
// };

export default NotesPage;
