import { useState } from 'react';
import { array } from 'prop-types';

import TextArea from './TextArea';
import { fetchNotes } from '../lib/api';

const Notes = ({ notes: initialNotes }) => {
  // console.log({ initialNotes });
  const [notes, setNotes] = useState(initialNotes);
  const updateNotes = async () => {
    const newNotes = await fetchNotes();
    setNotes(newNotes);
  };
  return <TextArea notes={notes} updateNotes={updateNotes} />;
};

Notes.propTypes = {
  notes: array.isRequired,
};

export default Notes;
