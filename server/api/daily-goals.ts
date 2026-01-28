import { eq, and } from 'drizzle-orm'
import { db } from '../db'
import { goals, dailyGoals } from '../db/schema'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const method = event.method

  if (method === 'GET') {
    const query = getQuery(event)
    const date = query.date as string || new Date().toISOString().split('T')[0]

    const userGoals = db.select().from(goals).where(eq(goals.userId, user.id)).all()
    const userDailyGoals = db.select()
      .from(dailyGoals)
      .where(and(eq(dailyGoals.userId, user.id), eq(dailyGoals.date, date)))
      .all()

    return userGoals.map(goal => {
      const dailyGoal = userDailyGoals.find(dg => dg.goalId === goal.id)
      return {
        id: goal.id,
        title: goal.title,
        completed: dailyGoal?.completed || false,
      }
    })
  }

  if (method === 'POST') {
    const { goalId, date, completed } = await readBody(event)
    const dateStr = date || new Date().toISOString().split('T')[0]

    const existing = db.select()
      .from(dailyGoals)
      .where(and(
        eq(dailyGoals.userId, user.id),
        eq(dailyGoals.goalId, goalId),
        eq(dailyGoals.date, dateStr)
      ))
      .get()

    if (existing) {
      db.update(dailyGoals)
        .set({ completed })
        .where(eq(dailyGoals.id, existing.id))
        .run()
    } else {
      db.insert(dailyGoals).values({
        userId: user.id,
        goalId,
        date: dateStr,
        completed,
      }).run()
    }

    return { success: true }
  }
})
