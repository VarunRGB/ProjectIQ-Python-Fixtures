'use strict';

// Minimal, operator-reviewed D3 fixture: single Express API service.
// No database, cloud access, subprocesses, or installation scripts.
const express = require('express');
const app = express();

app.get('/health', (_req, res) => {
  res.status(200).json({ service: 'projectiq-express-d3-fixture', status: 'ok' });
});

app.get('/api/ping', (_req, res) => {
  res.status(200).json({ pong: true });
});

const port = Number(process.env.PORT || 8765);
const host = process.env.HOST || '127.0.0.1';
app.listen(port, host);
