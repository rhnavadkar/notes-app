const express = require('express');
const { initDb, addNote, getNotes } = require('./database');
const app = express();

app.use(express.json());

// Initialize database when server starts
initDb().catch(err => console.error('Database initialization failed:', err));

app.get('/api/notes', async (req, res) => {
  try {
    const notes = await getNotes();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    await addNote(req.body.text);
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
