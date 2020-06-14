import Link from 'next/link'
import { X } from 'react-feather'

import Form from './styles/Form'
import Footer from './styles/Footer'
import useUser from '../lib/useUser'
import useForm from '../lib/useForm'
import { updateEmail, updateSessionEmail, updateAuthor } from '../lib/api'

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

export default () => {
  const user = useUser({ redirectTo: '/login?next=/notes' })

  return (
    <>
      {user ? (
        <>
          <ChangeEmailForm user={user} />
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
