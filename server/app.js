// server/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use('/chat', chatRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'QuailCare AI Server is running' });
});

module.exports = app;
