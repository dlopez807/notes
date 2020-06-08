import { useState } from 'react'
import Router, { useRouter } from 'next/router'
import { Magic } from 'magic-sdk'

import Form from './styles/Form'
import useUser from '../lib/useUser'
import { login } from '../lib/api'

export default () => {
  const router = useRouter()
  useUser({
    redirectTo: router.query.next || '/notes',
    redirectIfFound: true,
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const submit = async e => {
    e.preventDefault()
    setSubmitting(true)
    const body = {
      email: e.currentTarget.email.value,
    }
    try {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)
      const token = await magic.auth.loginWithMagicLink({
        email: body.email,
      })
      const res = await login({ token, body })
      if (res.status === 200) {
        Router.push(Router.query.next || '/notes')
      } else {
        throw new Error(await res.text())
      }
      setSubmitting(false)
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
      setErrorMessage(error.message)
      setSubmitting(false)
    }
  }
  return (
    <Form onSubmit={submit}>
      <h1>login</h1>
      <input type="email" name="email" placeholder="email" required />
      <button type="submit" disabled={submitting}>
        submit
        {submitting ? 'ting' : ''}
      </button>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </Form>
  )
}
