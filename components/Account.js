import Link from 'next/link'
import { X } from 'react-feather'

import Delete from './Delete'
import Form from './styles/Form'
import Footer from './styles/Footer'
import useUser from '../lib/useUser'
import useForm from '../lib/useForm'
import {
  updateEmail,
  updateSessionEmail,
  updateAuthor,
  deleteAccount,
  logout,
} from '../lib/api'

const ChangeEmailForm = ({ user }) => {
  const initialValues = { email: '', confirmEmail: '' }
  const {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    dirty,
    errors,
  } = useForm({
    initialValues,
    onSubmit: async ({ email }, { setSubmitting, setErrors }) => {
      const { error } = await updateEmail(email)
      if (!error) {
        await updateSessionEmail(email)
        await updateAuthor(user.email, email)
        await user.revalidate()
      } else setErrors({ email: 'there was a problem updating your email' })
      setSubmitting(false)
    },
    validate: submittedValues => {
      const newErrors = {}
      const { email, confirmEmail } = submittedValues
      if (email !== confirmEmail) newErrors.email = 'emails do not match'
      return newErrors
    },
  })
  const { email, confirmEmail } = values
  return (
    <Form onSubmit={handleSubmit}>
      <h2>change email</h2>
      <input
        name="email"
        value={email}
        placeholder="new email"
        onChange={handleChange}
      />
      <input
        name="confirmEmail"
        value={confirmEmail}
        placeholder="confirm email"
        onChange={handleChange}
      />
      {errors.email && <div className="error">{errors.email}</div>}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={!dirty || isSubmitting}
      >
        updat
        {isSubmitting ? 'ing' : 'e'}
      </button>
    </Form>
  )
}

const DeleteAccountForm = ({ user }) => {
  const initialValues = { email: '' }
  const {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    dirty,
    errors,
  } = useForm({
    initialValues,
    onSubmit: async ({ email }, { setSubmitting, setErrors }) => {
      const { error } = await deleteAccount(email)
      if (error)
        setErrors({ email: 'there was a problem deleting your account' })
      else await logout()
      setSubmitting(false)
    },
    validate: submittedValues => {
      const newErrors = {}
      const { email } = submittedValues
      if (email !== user.email) newErrors.email = 'emails do not match'
      return newErrors
    },
  })
  const { email } = values
  return (
    <Form>
      <h2>delete account</h2>
      <input
        name="email"
        value={email}
        placeholder="confirm your email"
        onChange={handleChange}
      />
      {errors.email && <div className="error">{errors.email}</div>}
      <Delete
        type="button"
        disabled={!dirty || isSubmitting}
        isSubmitting={isSubmitting}
        confirm="confirm delete"
        confirming="deleting"
        cancel="cancel delete"
        handleDelete={handleSubmit}
      >
        delete account
      </Delete>
    </Form>
  )
}

export default () => {
  const user = useUser({ redirectTo: '/login?next=/account' })

  return (
    <>
      {user ? (
        <>
          <ChangeEmailForm user={user} />
          <DeleteAccountForm user={user} />
        </>
      ) : (
        <div>loading</div>
      )}
      <Footer>
        <ul>
          <li>
            <Link href="/">
              <a>
                <X />
              </a>
            </Link>
          </li>
        </ul>
      </Footer>
    </>
  )
}
