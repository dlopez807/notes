import { useState } from 'react';
import { func } from 'prop-types';

const Delete = ({ handleDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <>
      {confirmDelete ? (
        <>
          <button type="button" onClick={handleDelete}>
            confirm delete
          </button>
          <button type="button" onClick={() => setConfirmDelete(false)}>
            cancel delete
          </button>
        </>
      ) : (
          <button type="button" onClick={() => setConfirmDelete(true)}>
            delete
          </button>
        )}
    </>
  );
};

Delete.propTypes = {
  handleDelete: func.isRequired,
};

export default Delete;
