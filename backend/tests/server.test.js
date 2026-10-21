const request = require('supertest');
const app = require('../server');

describe('Task Manager API health endpoint', () => {
  test('GET / returns the API running message', async () => {
    const response = await request(app).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Task Manager API is running'
    });
  });

  test('unknown route returns 404', async () => {
    const response = await request(app).get('/this-route-does-not-exist');

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Route not found');
  });
});
