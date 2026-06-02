import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  dailyCalorieGoal: integer('daily_calorie_goal').default(2000),
  createdAt: timestamp('created_at').defaultNow(),
})

export const goals = pgTable('goals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const dailyGoals = pgTable('daily_goals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  goalId: integer('goal_id').notNull().references(() => goals.id),
  date: text('date').notNull(),
  completed: boolean('completed').default(false),
})

export const meals = pgTable('meals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  date: text('date').notNull(),
  calories: integer('calories').notNull(),
  protein: integer('protein').default(0),
  fat: integer('fat').default(0),
  carbs: integer('carbs').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})
