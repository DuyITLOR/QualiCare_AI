// server/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(cors());
app.use(express.json());


app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'QuailCare AI Server is running' });
});

app.use('/api/chat', chatRoutes);


app.get('/', (_req, res) => res.send('Backend OK. Try /api/health'));

module.exports = app;
