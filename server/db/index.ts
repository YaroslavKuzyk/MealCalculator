import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/meal'

const client = postgres(connectionString)
export const db = drizzle(client, { schema })

// Bootstrap tables on startup. For real schema changes use drizzle-kit migrations.
// Called from a Nitro plugin (server/plugins/db.ts) so there is no top-level await.
export async function initDb() {
  await client.unsafe(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    daily_calorie_goal INTEGER DEFAULT 2000,
    created_at TIMESTAMP DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS daily_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    goal_id INTEGER NOT NULL REFERENCES goals(id),
    date TEXT NOT NULL,
    completed BOOLEAN DEFAULT false
  );

  CREATE TABLE IF NOT EXISTS meals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    date TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein INTEGER DEFAULT 0,
    fat INTEGER DEFAULT 0,
    carbs INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now()
  );
`)
}
