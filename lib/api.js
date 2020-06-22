import axios from 'axios'
import useSWR from 'swr'
import format from 'date-fns/format'
import subDays from 'date-fns/subDays'
import { Magic } from 'magic-sdk'

const fetcher = url => fetch(url).then(res => res.json())

const NOTES_API = '/api/notes'
const SWORD_API = '/api/sword'
const AUTH_API = '/api/auth'

const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{2}$/

export async function fetchDailyText(date) {
  let dt = date
  if (dt) {
    if (dt.includes('y')) {
      const ys = (dt.match(/y/g) || []).length
      dt = format(subDays(new Date(), ys), 'yyyy-M-d')
    } else if (dateRegex.test(date)) {
      const [month, day, year] = date.split('/')
      dt = format(
        new Date(
          parseInt(`20${year}`, 10),
          parseInt(month, 10) - 1,
          parseInt(day, 10)
        ),
        'yyyy-M-d'
      )
    } else dt = format(new Date(), 'yyyy-M-d')
  } else {
    dt = format(new Date(), 'yyyy-M-d')
  }
  const data = await fetcher(`${SWORD_API}/dt/${dt}`)
  return data
}

export const fetchText = async text =>
  fetcher(`${SWORD_API}/scriptures/${text}`)

export const fetchNotes = async id =>
  fetcher(`${NOTES_API}${id ? `/${id}` : ''}`)
export const getNotes = id =>
  useSWR(`${NOTES_API}${id ? `/${id}` : ''}`, fetcher)
export const searchNotes = query =>
  useSWR(
    `${NOTES_API}/search?${Object.entries(query).reduce(
      (queryString, [key, value]) => `${queryString}${key}=${value}&`,
      ''
    )}`,
    fetcher
  )

export const saveNote = async ({ title, body, slug, tags, hook, author }) =>
  axios.post(`${NOTES_API}`, {
    title,
    body,
    slug,
    tags,
    hook,
    author,
  })

export const updateNote = async ({
  title,
  body,
  slug,
  tags,
  hook,
  _id,
  author,
}) => {
  try {
    await axios.patch(`${NOTES_API}/${_id}`, {
      title,
      body,
      slug,
      tags,
      hook,
      author,
    })
    return { success: true }
  } catch (e) {
    return {
      error: e,
    }
  }
}

export const deployNote = async id => {
  try {
    await axios.post(`${NOTES_API}/${id}`)
    return { success: true }
  } catch (error) {
    console.log({ error })
    return {
      error,
    }
  }
}

export const deleteNote = async id => axios.delete(`${NOTES_API}/${id}`)

const searchUrl = query =>
  `${NOTES_API}/search?${Object.entries(query).reduce(
    (queryString, [key, value]) => `${queryString}${key}=${value}&`,
    ''
  )}`

export const updateAuthor = async (oldAuthor, newAuthor) => {
  const notes = await fetcher(searchUrl({ author: oldAuthor }))
  const updates = notes.map(({ _id }) =>
    updateNote({
      _id,
      author: newAuthor,
    })
  )
  const responses = await Promise.all(updates)
  console.log({ responses })
}

export const updateSessionEmail = async email =>
  axios.post(`${AUTH_API}/updateEmail`, {
    email,
  })

export const updateEmail = async email => {
  const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)
  // Initiates the flow to update a user's current email to a new one.
  try {
    /* Assuming user is logged in */
    await magic.user.updateEmail({ email })
    return {
      success: true,
    }
  } catch (e) {
    return { error: e }
  }
}

export const deleteAccount = async email => {
  try {
    const notes = await fetcher(searchUrl({ author: email }))
    const deletePromises = notes.map(({ _id }) => deleteNote(_id))
    const responses = await Promise.all(deletePromises)
    console.log({ deleteAccount: responses })
    return { success: true }
  } catch (e) {
    return { error: e }
  }
}

export const login = async ({ token, body }) =>
  fetch(`${AUTH_API}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })
export const logout = () => (window.location.href = `${AUTH_API}/logout`)
export const getUser = () => useSWR(`${AUTH_API}/user`, fetcher)
