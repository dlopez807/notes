import axios from 'axios';

import { Note } from '../../../lib/models';

export default async (req, res) => {
  const {
    method,
    query: { id },
  } = req;
  if (method === 'PATCH') {
    Note.findById(id, async (err, note) => {
      if (err) res.send(err);

      const { title, body, slug, tags, hook } = req.body;
      if (title) note.title = title;
      if (body) note.body = body;
      if (slug) note.slug = slug;
      if (tags) note.tags = tags.split(' ');
      if (hook) note.hook = hook;
      // note.title = req.body.title;
      // note.body = req.body.body;
      // note.slug = req.body.slug;
      // note.tags = req.body.tags?.split(' ');
      if (note.title.startsWith('# ')) {
        const md = await axios.post('https://marked.now.sh', {
          text: `${note.title}\n${note.body}`,
        });
        note.markdown = md.data;
      } else {
        note.markdown = null;
      }
      if (note.title.startsWith('= ') || note.title.startsWith('[ ')) {
        const list = note.body.split('\n').filter(item => item !== '');
        if (note.title.startsWith('= ')) {
          note.list = list;
          // const formatItem = item => {
          //   let result = item;
          //   if (result.includes('\t')) result = item.split('\t');
          //   return result;
          // };
          // note.list = list.filter(item => item !== '').map(formatItem);
          note.table = list.map(item => item.split('\t'));
        } else {
          note.table = list.map(i => {
            const [item, checked] = i.split('\t');
            return [item, checked?.toLowerCase() === 'x' ? 'x' : ''];
          });
        }
      } else {
        note.list = null;
        note.table = null;
      }

      // note.save(async (err, updatedNote) => {
      //   if (err) res.send(err);
      //   if (updatedNote.hook) {
      //     await axios.post(updatedNote.hook);
      //   }

      //   res.json({
      //     message: 'note updated',
      //     note: updatedNote,
      //   });
      // });

      const updatedNote = await note.save();
      // if (updatedNote.hook) {
      //   await axios.post(updatedNote.hook);
      // }
      res.json(updatedNote);
    });
    // const note = new Note();
    // note.title = req.body.title;
    // note.body = req.body.body;
    // note.save((err, savedNote) => {
    //   if (err) res.send(err);
    //   res.json({
    //     message: 'note created',
    //     savedNote,
    //   });
    // });
  } else if (method === 'POST') {
    const note = await Note.findById(id).exec();
    if (note.hook) await axios.post(note.hook);
    res.json(note);
  } else if (method === 'DELETE') {
    // const note = new Note();
    // note.title = req.body.title;
    // note.body = req.body.body;
    // note.save((err, savedNote) => {
    //   if (err) res.send(err);
    //   res.json({
    //     message: 'note created',
    //     savedNote,
    //   });
    // });
    Note.remove(
      {
        _id: id,
      },
      err => {
        if (err) res.send(err);

        res.json({
          message: 'successfully deleted',
        });
      }
    );
  } else {
    Note.findById(id, (err, note) => {
      if (err) res.send(err);
      res.json({
        success: true,
        message: `/api/${id}`,
        note,
      });
    });
  }
};
