import axios from 'axios'
import useSWR from 'swr'
import format from 'date-fns/format'
import subDays from 'date-fns/subDays'

const fetcher = url => fetch(url).then(res => res.json())

const NOTES_API = '/api/notes'
const SWORD_API = '/api/sword'

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

export const saveNote = async ({ title, body, slug, tags, hook }) =>
  axios.post(`${NOTES_API}`, {
    title,
    body,
    slug,
    tags,
    hook,
  })

export const updateNote = async ({ title, body, slug, tags, hook, _id }) =>
  axios.patch(`${NOTES_API}/${_id}`, {
    title,
    body,
    slug,
    tags,
    hook,
  })

export const deployNote = async id => axios.post(`${NOTES_API}/${id}`)

export const deleteNote = async id => axios.delete(`${NOTES_API}/${id}`)
