import mongoose from 'mongoose';

// const mongoDB = 'mongodb://admin:admin@ds019856.mlab.com:19856/niello';
const mongoDB = 'mongodb://dlopez807:dlopez807@ds031567.mlab.com:31567/bacon';
const db = mongoose.connection;

mongoose.connect(
  mongoDB,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const NoteSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    slug: String,
    tags: [String],
    markdown: String,
    list: [String],
    table: [[String]],
    hook: String,
  },
  { timestamps: true }
);

const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);

export { Note };
