import { useEffect } from 'react'
import Router from 'next/router'

import { getUser } from './api'

export default ({ redirectTo, redirectIfFound } = {}) => {
  const { data, error } = getUser()
  const user = data?.email
  const finished = Boolean(data)
  const hasUser = Boolean(user)

  useEffect(
    () => {
      if (!redirectTo || !finished) return
      if (
        // If redirectTo is set, redirect if the user was not found.
        (redirectTo && !redirectIfFound && !hasUser) ||
        // If redirectIfFound is also set, redirect if the user was found
        (redirectIfFound && hasUser)
      ) {
        Router.push(redirectTo)
      }
    },
    [data, user, redirectTo, redirectIfFound, finished, hasUser]
  )

  return error ? null : data
}
