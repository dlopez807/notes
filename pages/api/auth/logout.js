import { magic } from '../../../lib/auth/magic'
import { removeTokenCookie } from '../../../lib/auth/cookies'
import { getSession } from '../../../lib/auth/iron'

export default async function logout(req, res) {
  const session = await getSession(req)
  await magic.users.logoutByIssuer(session.issuer)
  removeTokenCookie(res)
  res.writeHead(302, { Location: '/' })
  res.end()
}
