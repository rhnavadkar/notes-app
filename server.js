const express = require('express');
const { initDb, addNote, getNotes } = require('./database');
const app = express();

app.use(express.json());

// Initialize database when server starts
initDb().catch(err => console.error('Database initialization failed:', err));

// Add this route handler to handle the root URL
app.get('/', async (req, res) => {
  try {
    const notes = await getNotes();
    // Formats your notes into a clean bulleted HTML list for the browser
    const htmlList = notes.map(note => `<li>${note}</li>`).join('');
    res.send(`
      <h1>My Notes App</h1>
      <ul>${htmlList}</ul>
      <p>Server is running perfectly!</p>
    `);
  } catch (err) {
    res.status(500).send(`Error loading page: ${err.message}`);
  }
});
