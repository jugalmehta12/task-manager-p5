const Task = require('../models/Task');
const cache = require('../cache');
const taskEmitter = require('../events');

// @desc    Get all tasks
// @route   GET /api/tasks
exports.getAllTasks = async (req, res, next) => {
  try {
    const cachedTasks = cache.get('all_tasks');
    if (cachedTasks !== undefined) {
      return res.status(200).json({
        success: true,
        count: cachedTasks.length,
        data: cachedTasks,
        cache: 'HIT'
      });
    }
    const tasks = await Task.find().sort({ createdAt: -1 });
    cache.set('all_tasks', tasks);
    res.status(200).json({ success: true, count: tasks.length, data: tasks, cache: 'MISS' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single task by id
// @route   GET /api/tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const cacheKey = `task:${req.params.id}`;
    const cachedTask = cache.get(cacheKey);
    if (cachedTask !== undefined) {
      return res.status(200).json({ success: true, data: cachedTask, cache: 'HIT' });
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with id ${req.params.id}`
      });
    }
    cache.set(cacheKey, task);
    res.status(200).json({ success: true, data: task, cache: 'MISS' });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// ---------------------------------------------------------------------------
// Practical 10 changes:
//   1. Save the task and respond with HTTP 201 immediately (unchanged).
//   2. After sending the response, schedule the 'task-created' event with
//      setImmediate so the emit happens on the very next iteration of the
//      event loop — after the response has been flushed to the client.
//   3. The listener fires synchronously, but immediately schedules a 2-second
//      async delay, so it returns without blocking the event loop.
//
// The net result is:
//   - Client receives 201 in ~tens of ms (DB write latency only).
//   - Console shows [API] response timestamp.
//   - ~2 seconds later, console shows notification completion.
// ---------------------------------------------------------------------------
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    cache.invalidateTasks();

    // Send the HTTP response first
    res.status(201).json({ success: true, data: task });
    console.log(`[API] POST /tasks response sent at: ${new Date().toISOString()}`);

    // Emit the event on the next event-loop tick (after the response is sent)
    setImmediate(() => {
      taskEmitter.emit('task-created', {
        task,
        userId: req.user ? req.user.id : 'unauthenticated'
      });
    });
  } catch (err) {
    next(err); // ValidationError caught here and formatted by errorHandler
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document, not the original
      runValidators: true // re-run schema validation on update
    });
    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with id ${req.params.id}`
      });
    }
    cache.invalidateTasks();
    res.status(200).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// ---------------------------------------------------------------------------
// Practical 10 changes:
//   After the DB deletion succeeds and the response is sent, emit 'task-deleted'
//   so the notification listener can log the deletion asynchronously.
// ---------------------------------------------------------------------------
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: `Task not found with id ${req.params.id}`
      });
    }
    cache.invalidateTasks();
    res.status(200).json({ success: true, data: {} });

    // Emit deletion event after response is sent
    setImmediate(() => {
      taskEmitter.emit('task-deleted', { task });
    });
  } catch (err) {
    next(err);
  }
};
