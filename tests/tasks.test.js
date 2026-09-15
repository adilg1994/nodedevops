const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/db');

afterAll(async () => {
  await pool.end();
});

describe('Tasks API', () => {
  it('creates a task and returns it', async () => {
    const res = await request(app).post('/tasks').send({ title: 'Write CI/CD tests' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Write CI/CD tests');
    expect(res.body.completed).toBe(false);
  });

  it('rejects a task with no title', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.status).toBe(400);
  });

  it('lists tasks including the one just created', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('marks a task as completed', async () => {
    const createRes = await request(app).post('/tasks').send({ title: 'Mark me done' });
    const patchRes = await request(app).patch(`/tasks/${createRes.body.id}`);
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.completed).toBe(true);
  });

  it('returns 404 for a non-existent task', async () => {
    const res = await request(app).patch('/tasks/999999');
    expect(res.status).toBe(404);
  });
});