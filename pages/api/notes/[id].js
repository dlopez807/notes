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
  connect(process.env.MLAB_URI)
  if (method === 'PATCH') {
    const { title, body, slug, tags, hook } = req.body
    const note = await saveNote({ id, title, body, slug, tags, hook })
    res.json(note)
  } else if (method === 'DELETE') {
    const response = deleteNote(id)
    res.json(response)
  } else if (method === 'POST') {
    const response = deployNote(id)
    res.json(response)
  } else {
    const note = await getNotes({ id })
    res.json(note)
  }
}
