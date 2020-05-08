import moment from 'moment'
import axios from 'axios'
import useSWR from 'swr'

const fetcher = url => fetch(url).then(res => res.json())

const NOTES_API = '/api/notes'
const SWORD_API = '/api/sword'

export async function fetchDailyText(date) {
  let dt = date
  if (dt) {
    if (dt.includes('y')) {
      const ys = (dt.match(/y/g) || []).length
      dt = moment()
        .subtract(ys, 'days')
        .format('YYYY-M-D')
    } else dt = moment(dt).format('YYYY-M-D')
  } else {
    dt = moment().format('YYYY-M-D')
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
