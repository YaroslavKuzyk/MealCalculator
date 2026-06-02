import { eq, and } from 'drizzle-orm'
import { db } from '../db'
import { goals, dailyGoals } from '../db/schema'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const method = event.method

  if (method === 'GET') {
    return await db.select().from(goals).where(eq(goals.userId, user.id))
  }

  if (method === 'POST') {
    const { title } = await readBody(event)

    if (!title) {
      throw createError({
        statusCode: 400,
        message: 'Назва обов\'язкова',
      })
    }

    const [goal] = await db.insert(goals).values({
      userId: user.id,
      title,
    }).returning()

    return goal
  }

  if (method === 'DELETE') {
    const query = getQuery(event)
    const id = Number(query.id)

    await db.delete(dailyGoals).where(eq(dailyGoals.goalId, id))
    await db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, user.id)))

    return { success: true }
  }
})
