import os
import sys
import json
import sqlite3

# Update this path so it uses the persistent volume folder on Render
DB_FILE = "/var/data/database.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)")
    conn.commit()
    conn.close()

def add_note(text):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO notes (text) VALUES (?)", (text,))
    conn.commit()
    conn.close()
    return {"status": "success"}

def get_notes():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # Check if table exists to avoid operational crashes on first load
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='notes'")
    if not cursor.fetchone():
        return []
    cursor.execute("SELECT text FROM notes")
    notes = [row[0] for row in cursor.fetchall()]
    conn.close()
    return notes

if __name__ == "__main__":
    # Expecting command argument structure: script.py '{"action":"get"}'
    try:
        input_data = json.loads(sys.argv[1])
        action = input_data.get("action")
        
        if action == "init":
            init_db()
            print(json.dumps({"status": "initialized"}))
        elif action == "add":
            res = add_note(input_data.get("text", ""))
            print(json.dumps(res))
        elif action == "get":
            notes = get_notes()
            print(json.dumps(notes))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
