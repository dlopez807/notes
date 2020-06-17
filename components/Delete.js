import { useState } from 'react'
import { func, node, bool } from 'prop-types'
import { Trash2, CheckCircle, XCircle } from 'react-feather'

const Delete = ({
  handleDelete,
  isSubmitting,
  confirm,
  confirming,
  cancel,
  children,
  ...props
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  return (
    <>
      {confirmDelete ? (
        <>
          <button
            className="delete"
            type="button"
            disabled={isSubmitting}
            onClick={async () => {
              setConfirmDelete(false)
              await handleDelete()
            }}
          >
            {isSubmitting ? confirming : confirm}
          </button>
          <button
            className="delete-cancel"
            type="button"
            onClick={() => setConfirmDelete(false)}
          >
            {cancel}
          </button>
        </>
      ) : (
        <button
          className="delete"
          type="button"
          {...props}
          onClick={() => setConfirmDelete(true)}
        >
          {children}
        </button>
      )}
    </>
  )
}

Delete.propTypes = {
  handleDelete: func.isRequired,
  confirm: node,
  confirming: node,
  cancel: node,
  isSubmitting: bool,
  children: node,
}

Delete.defaultProps = {
  confirm: <CheckCircle />,
  confirming: <CheckCircle />,
  cancel: <XCircle />,
  isSubmitting: false,
  children: <Trash2 />,
}

export default Delete
