const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const app = require('../app');

test('GET / returns API health payload', async (t) => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { message: 'Task Manager API is running' });
});
