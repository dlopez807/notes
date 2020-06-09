import Iron from '@hapi/iron'
import { getTokenCookie } from './cookies'

// Use an environment variable here instead of a hardcoded value for production
// const TOKEN_SECRET = 'this-is-a-secret-value-with-at-least-32-characters'
const TOKEN_SECRET = 'currythompsoniguodaladurantgreen'

export function encryptSession(session) {
  return Iron.seal(session, TOKEN_SECRET, Iron.defaults)
}

export async function getSession(req) {
  const token = getTokenCookie(req)
  return token && Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
}