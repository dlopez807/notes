import axios from 'axios';

import { Note } from '../../../lib/models';

export default async (req, res) => {
  const { method, query } = req;
  if (method === 'POST') {
    const note = new Note();
    note.title = req.body.title;
    note.body = req.body.body;
    note.slug = req.body.slug;
    note.tags = req.body.tags?.split(' ');
    if (note.title.startsWith('# ')) {
      const md = await axios.post('https://marked.now.sh', {
        text: `${note.title}\n${note.body}`,
      });
      note.markdown = md.data;
    }
    if (note.title.startsWith('= ') || note.title.startsWith('[ ')) {
      const list = note.body.split('\n').filter(item => item !== '');
      if (note.title.startsWith('= ')) {
        note.list = list;
        note.table = list.map(item => item.split('\t'));
      } else {
        note.table = list.map(i => {
          const [item, checked] = i.split('\t');
          return [item, checked || false];
        });
      }
    }
    note.save((err, savedNote) => {
      if (err) res.send(err);
      res.json({
        message: 'note created',
        savedNote,
      });
    });
  } else {
    const { date } = query;
    const notes = await Note.find()
      .sort({ updatedAt: date === 'asc' ? 1 : -1 })
      .exec();
    res.json({
      path: '/api/notes',
      notes,
    });
    // Note.find((err, allNotes) => {
    //   if (err) res.send(err);
    //   res.json({
    //     success: true,
    //     message: '/api/notes',
    //     notes: allNotes,
    //     // notes: allNotes.map(({ _id, title, body, slug, tags }) => ({
    //     //   _id,
    //     //   title,
    //     //   body,
    //     //   slug,
    //     //   tags: tags.join(' '),
    //     // })),
    //   });
    // });
  }
};
