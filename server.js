const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const PYTHON = process.env.PYTHON || 'python';

app.use(express.json());
// Serve static asset files directly from current folder
app.use(express.static(__dirname)); 

// Helper function to interact safely with script.py
function runPython(action, payload = {}) {
    return new Promise((resolve, reject) => {
        const argumentData = JSON.stringify({ action, ...payload });
        const pythonProcess = spawn(PYTHON, ['script.py', argumentData]);

        let output = '';
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.on('close', () => {
            try {
                resolve(JSON.parse(output.trim()));
            } catch (e) {
                reject("Invalid response from Python worker script: " + output);
            }
        });
    });
}

// REST endpoints mapped to Python Actions
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await runPython('get');
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const outcome = await runPython('add', { text: req.body.text });
        res.json(outcome);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Initialize database via python call right before server starts
runPython('init').then(() => {
    app.listen(PORT, () => console.log(`Application running dynamically at http://localhost:${PORT}`));
});
