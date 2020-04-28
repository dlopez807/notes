import Notes from '../components/Notes';
import Notepad from '../components/Notepad';
import { fetchNotes } from '../lib/api';

const NotesPage = () => <Notepad />;

// NotesPage.getInitialProps = async () => {
//   const notes = await fetchNotes();
//   return { notes };
// };

export default NotesPage;
