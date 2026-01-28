import { eq, and, desc } from 'drizzle-orm'
import { db } from '../db'
import { meals } from '../db/schema'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const method = event.method

  if (method === 'GET') {
    const query = getQuery(event)
    const date = query.date as string || new Date().toISOString().split('T')[0]

    return db.select()
      .from(meals)
      .where(and(eq(meals.userId, user.id), eq(meals.date, date)))
      .orderBy(desc(meals.createdAt))
      .all()
  }

  if (method === 'POST') {
    const { date, calories, protein, fat, carbs } = await readBody(event)

    return db.insert(meals).values({
      userId: user.id,
      date: date || new Date().toISOString().split('T')[0],
      calories: calories || 0,
      protein: protein || 0,
      fat: fat || 0,
      carbs: carbs || 0,
    }).returning().get()
  }

  if (method === 'DELETE') {
    const query = getQuery(event)
    const id = Number(query.id)

    db.delete(meals)
      .where(and(eq(meals.id, id), eq(meals.userId, user.id)))
      .run()

    return { success: true }
  }
})
