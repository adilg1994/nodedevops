const { pgTable, serial, text, boolean, timestamp } = require('drizzle-orm/pg-core');

const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

module.exports = { tasks };