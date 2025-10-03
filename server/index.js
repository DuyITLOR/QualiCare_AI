require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');
const cageRoutes = require('./routes/cageRoutes');
const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cages', cageRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'QuailCare AI Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});