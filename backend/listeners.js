const taskEmitter = require('./events');
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function handleTaskCreated({ task, userId }) {
  try {
    console.log('\n[Notification] task-created event received');
    console.log(`[Notification] Task: ${task.title}`);
    console.log(`[Notification] Assigned User: ${userId || 'unknown'}`);

    const startedAt = new Date().toISOString();
    console.log(`[Notification] Processing started at: ${startedAt}`);
    await delay(2000);

    const completedAt = new Date().toISOString();
    console.log(`[Notification] Processing completed at: ${completedAt}\n`);
  } catch (err) {
    taskEmitter.emit('error', { event: 'task-created', message: err.message });
  }
}
function handleTaskDeleted({ task }) {
  try {
    console.log('\n[Notification] Task deleted successfully:', task.title || task._id);
    console.log(`[Notification] Deletion event processed at: ${new Date().toISOString()}\n`);
  } catch (err) {
    taskEmitter.emit('error', { event: 'task-deleted', message: err.message });
  }
}
function handleError({ event, message }) {
  console.error(`\n[Background Error] Event: ${event}`);
  console.error(`[Background Error] Message: ${message}`);
  console.error(`[Background Error] Timestamp: ${new Date().toISOString()}\n`);
}

function registerListeners() {
  taskEmitter.on('error', handleError);
  taskEmitter.on('task-created', (payload) => {
    handleTaskCreated(payload);
  });

  taskEmitter.on('task-deleted', handleTaskDeleted);

  console.log('[Events] Task event listeners registered');
}

module.exports = { registerListeners };
