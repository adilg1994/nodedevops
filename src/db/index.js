require('dotenv').config();
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { tasks } = require('./schema');

const connectionString = process.env.DATABASE_URL;

// Neon requires SSL; the local Postgres service container in CI does not.
const pool = new Pool({
  connectionString,
  ssl: connectionString && connectionString.includes('sslmode=require')
    ? { rejectUnauthorized: false }
    : false,
});

const db = drizzle(pool, { schema: { tasks } });

module.exports = { db, pool, tasks };