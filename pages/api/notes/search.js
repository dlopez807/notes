import { Note } from '../../../lib/models';

export default async (req, res) => {
  const { query } = req;

  const notes = await Note.find(query).exec();

  res.json({
    path: '/api/notes/search',
    query,
    notes,
  });
};
