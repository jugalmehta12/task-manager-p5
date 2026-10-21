const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const logger = require('./middleware/logger');
const requireJsonContentType = require('./middleware/requireJsonContentType');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const { registerListeners } = require('./listeners');

const app = express();

// Global middleware pipeline
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(requireJsonContentType);

// Public routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Task Manager API is running' });
});

app.use('/api/auth', authRoutes);

// Protected task routes
app.use('/api/tasks', taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.originalUrl}`
  });
});

// Global error handler — must be LAST
app.use(errorHandler);

// Expose the app so tests can exercise HTTP routes without opening a port or
// connecting to MongoDB. This is safe for the production entry point too.
module.exports = app;

// Connect to MongoDB and start the server only when this file is executed
// directly (node server.js), not when imported by Jest/Supertest.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';

  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('MongoDB connected');
      registerListeners();
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
}
