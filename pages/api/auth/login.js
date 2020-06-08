import { magic } from '../../../lib/auth/magic'
import { encryptSession } from '../../../lib/auth/iron'
import { setTokenCookie } from '../../../lib/auth/cookies'

export default async function login(req, res) {
  try {
    const didToken = req.headers.authorization.substr(7)
    const metadata = await magic.users.getMetadataByToken(didToken)
    const session = { ...metadata }
    // The token is a string with the encrypted session
    const token = await encryptSession(session)
    setTokenCookie(res, token)
    res.status(200).send({ done: true })
  } catch (error) {
    res.status(error.status || 500).end(error.message)
  }
}
