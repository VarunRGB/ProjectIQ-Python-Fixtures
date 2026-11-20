'use strict';

// Reviewed D4 acceptance fixture: no cloud services, no external database.
// This local SQLite database exists only in the disposable execution VM.
const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const app = express();
const db = new DatabaseSync(path.join(process.cwd(), 'd4-disposable.sqlite'));
db.exec('CREATE TABLE IF NOT EXISTS probe (id INTEGER PRIMARY KEY, value TEXT NOT NULL)');

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/api/sqlite-check', (_req, res) => {
  try {
    db.prepare('INSERT OR REPLACE INTO probe (id, value) VALUES (?, ?)').run(1, 'created');
    const created = db.prepare('SELECT value FROM probe WHERE id = ?').get(1);
    db.prepare('UPDATE probe SET value = ? WHERE id = ?').run('verified', 1);
    const updated = db.prepare('SELECT value FROM probe WHERE id = ?').get(1);
    db.prepare('DELETE FROM probe WHERE id = ?').run(1);
    const count = db.prepare('SELECT COUNT(*) AS total FROM probe').get().total;
    res.json({
      sqlite: created?.value === 'created' && updated?.value === 'verified' && count === 0,
      operation: 'create-insert-read-update-read-delete',
      value: updated?.value,
      rows_after_delete: count
    });
  } catch (_err) {
    res.status(500).json({ sqlite: false });
  }
});

const port = Number(process.env.PORT || 8766);
app.listen(port, '127.0.0.1');
