import { eq, and, desc } from 'drizzle-orm'
import { db } from '../db'
import { meals } from '../db/schema'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const method = event.method

  if (method === 'GET') {
    const query = getQuery(event)
    const date = query.date as string || new Date().toISOString().split('T')[0]

    return await db.select()
      .from(meals)
      .where(and(eq(meals.userId, user.id), eq(meals.date, date)))
      .orderBy(desc(meals.createdAt))
  }

  if (method === 'POST') {
    const { date, calories, protein, fat, carbs } = await readBody(event)

    const [meal] = await db.insert(meals).values({
      userId: user.id,
      date: date || new Date().toISOString().split('T')[0],
      calories: calories || 0,
      protein: protein || 0,
      fat: fat || 0,
      carbs: carbs || 0,
    }).returning()

    return meal
  }

  if (method === 'DELETE') {
    const query = getQuery(event)
    const id = Number(query.id)

    await db.delete(meals)
      .where(and(eq(meals.id, id), eq(meals.userId, user.id)))

    return { success: true }
  }
})
