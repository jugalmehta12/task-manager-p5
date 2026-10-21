const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const logger = require('./middleware/logger');
const requireJsonContentType = require('./middleware/requireJsonContentType');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

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

module.exports = app;
