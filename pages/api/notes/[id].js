import { update } from '../../../lib/db'

const {
  connect,
  getNotes,
  saveNote,
  deleteNote,
  deployNote,
} = require('@baconjuice/notes')

export default async (req, res) => {
  const {
    method,
    query: { id },
  } = req
  connect(process.env.MONGO_URI)
  if (method === 'PATCH') {
    const { title, body, slug, tags, hook, author } = req.body
    const note = await saveNote({ id, title, body, slug, tags, hook, author })
    await update(note)
    res.json(note)
  } else if (method === 'DELETE') {
    const response = await deleteNote(id)
    res.json(response)
  } else if (method === 'POST') {
    const response = await deployNote(id)
    res.json(response)
  } else {
    const note = await getNotes({ id })
    res.json(note)
  }
}
