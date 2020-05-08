import { useState } from 'react'
import { func } from 'prop-types'
import { Trash2, CheckCircle, XCircle } from 'react-feather'

const Delete = ({ handleDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  return (
    <>
      {confirmDelete ? (
        <>
          <button type="button" onClick={handleDelete}>
            <CheckCircle />
          </button>
          <button type="button" onClick={() => setConfirmDelete(false)}>
            <XCircle />
          </button>
        </>
      ) : (
        <button type="button" onClick={() => setConfirmDelete(true)}>
          <Trash2 />
        </button>
      )}
    </>
  )
}

Delete.propTypes = {
  handleDelete: func.isRequired,
}

export default Delete
