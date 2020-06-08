import { getSession } from '../../../lib/auth/iron'

export default async (req, res) => {
  const session = await getSession(req)
  // After getting the session you may want to fetch for the user instead
  // of sending the session's payload directly, this example doesn't have a DB
  // so it won't matter in this case
  const roles = ['user']
  if (process.env.DEV_EMAIL && session?.email === process.env.DEV_EMAIL)
    roles.push('dev')
  const user = session
    ? {
        ...session,
        roles,
        isDev: roles.some(role => role === 'dev'),
      }
    : {
        roles,
        isGuest: true,
      }
  res.status(200).json(user)
}
