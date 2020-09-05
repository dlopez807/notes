import admin from 'firebase-admin'

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  })
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    // eslint-disable-next-line no-console
    console.error('Firebase admin initialization error', error.stack)
  }
}

const db = admin.firestore()

const save = async note => {
  const fireNote = {
    title: note.title,
    body: note.body,
    slug: note.slug || '',
    tags: note.tags || [],
    markdown: note.markdown || '',
    list: note.list || [],
    table: note.list || [],
    author: note.author || '',
    hook: note.hook || '',
  }
  await db
    .collection('notes')
    .doc(`${note._id}`)
    .set(fireNote)
}

const update = async note => {
  const fireNote = {
    title: note.title,
    body: note.body,
    slug: note.slug || '',
    tags: note.tags || [],
    markdown: note.markdown || '',
    list: note.list || [],
    table: note.list || [],
    author: note.author || '',
    hook: note.hook || '',
  }
  const doc = await db
    .collection('notes')
    .doc(`${note._id}`)
    .get()
  const savedNote = { id: doc.id, ...doc.data() }
  if (savedNote)
    await db
      .collection('notes')
      .doc(`${note._id}`)
      .update(fireNote)
  else
    await db
      .collection('notes')
      .doc(`${note._id}`)
      .set(fireNote)
}

export { save, update }
