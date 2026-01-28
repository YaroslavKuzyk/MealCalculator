import { eq, and } from 'drizzle-orm'
import { db } from '../db'
import { goals, dailyGoals } from '../db/schema'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const method = event.method

  if (method === 'GET') {
    return db.select().from(goals).where(eq(goals.userId, user.id)).all()
  }

  if (method === 'POST') {
    const { title } = await readBody(event)

    if (!title) {
      throw createError({
        statusCode: 400,
        message: 'Назва обов\'язкова',
      })
    }

    return db.insert(goals).values({
      userId: user.id,
      title,
    }).returning().get()
  }

  if (method === 'DELETE') {
    const query = getQuery(event)
    const id = Number(query.id)

    db.delete(dailyGoals).where(eq(dailyGoals.goalId, id)).run()
    db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, user.id))).run()

    return { success: true }
  }
})
