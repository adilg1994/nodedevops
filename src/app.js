const express = require('express');
const { eq } = require('drizzle-orm');
const { db, tasks } = require('./db');

const app = express();
app.use(express.json());

app.get('/tasks', async (req, res) => {
  const allTasks = await db.select().from(tasks);
  res.json(allTasks);
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }
  const [newTask] = await db.insert(tasks).values({ title }).returning();
  res.status(201).json(newTask);
});

app.patch('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);
  const [updated] = await db
    .update(tasks)
    .set({ completed: true })
    .where(eq(tasks.id, id))
    .returning();

  if (!updated) {
    return res.status(404).json({ error: 'task not found' });
  }
  res.json(updated);
});

module.exports = app;