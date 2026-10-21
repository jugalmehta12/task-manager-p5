const express = require('express');
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const { validateTask } = require('../middleware/validate');
const cache = require('../cache');

// All task routes require authentication
router.use(auth);

// Practical 9 supplementary endpoint: observe cache hit/miss behavior while testing.
router.get('/debug/cache', (req, res) => {
  res.status(200).json({ success: true, data: cache.snapshot() });
});

router.route('/')
  .get(getAllTasks)
  .post(validateTask, createTask);

router.route('/:id')
  .get(validateObjectId, getTaskById)
  .put(validateObjectId, validateTask, updateTask)
  .delete(validateObjectId, deleteTask);

module.exports = router;
