import { useState, useEffect } from 'react';
import { array } from 'prop-types';

import TextArea from './TextArea';
import { fetchNotes } from '../lib/api';

const Notes = ({ notes: initialNotes }) => {
  // console.log({ initialNotes });
  const [notes, setNotes] = useState(initialNotes);
  const updateNotes = async () => {
    const newNotes = await fetchNotes();
    setNotes(newNotes);
    console.log('notes updated');
  };
  useEffect(() => {
    async function update() {
      await updateNotes();
    }
    update();
  }, []);
  return <TextArea notes={notes} updateNotes={updateNotes} />;
};

Notes.propTypes = {
  notes: array,
};

Notes.defaultProps = {
  notes: [],
};

export default Notes;
