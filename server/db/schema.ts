import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  dailyCalorieGoal: integer('daily_calorie_goal').default(2000),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
})

export const goals = sqliteTable('goals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
})

export const dailyGoals = sqliteTable('daily_goals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  goalId: integer('goal_id').notNull().references(() => goals.id),
  date: text('date').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false),
})

export const meals = sqliteTable('meals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  date: text('date').notNull(),
  calories: integer('calories').notNull(),
  protein: integer('protein').default(0),
  fat: integer('fat').default(0),
  carbs: integer('carbs').default(0),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
})
