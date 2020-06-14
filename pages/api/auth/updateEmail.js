import { updateSession } from '../../../lib/auth/iron'
import { setTokenCookie } from '../../../lib/auth/cookies'

export default async function updateEmail(req, res) {
  try {
    const { email } = req.body
    const token = await updateSession(req, email)
    setTokenCookie(res, token)
    res.status(200).send({ email, done: true })
  } catch (error) {
    res.status(error.status || 500).end(error.message)
  }
}
