const mongoose = require('mongoose');
const app = require('./app');

const { registerListeners } = require('./listeners');

// Connect to MongoDB, then start the server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    // Practical 10: register event listeners once, after DB is ready
    registerListeners();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
