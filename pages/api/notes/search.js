const { connect, searchNotes } = require('@baconjuice/notes')

export default async (req, res) => {
  const { query } = req
  connect(process.env.MONGO_URI)
  const notes = await searchNotes(query)
  res.json(notes)
}
