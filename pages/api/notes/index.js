const { connect, getNotes, saveNote } = require('@baconjuice/notes')

export default async (req, res) => {
  const { method, query } = req
  connect(process.env.MLAB_URI)
  if (method === 'POST') {
    const { title, body, slug, tags, hook } = req.body
    const note = await saveNote({ title, body, slug, tags, hook })
    res.json(note)
  } else {
    const notes = await getNotes({ query })
    res.json(notes)
  }
}
