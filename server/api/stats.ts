import { eq, and } from 'drizzle-orm'
import { db } from '../db'
import { meals } from '../db/schema'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const query = getQuery(event)
  const date = query.date as string || new Date().toISOString().split('T')[0]

  const userMeals = await db.select()
    .from(meals)
    .where(and(eq(meals.userId, user.id), eq(meals.date, date)))

  const totals = userMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      fat: acc.fat + (meal.fat || 0),
      carbs: acc.carbs + (meal.carbs || 0),
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  )

  return {
    date,
    ...totals,
    mealsCount: userMeals.length,
  }
})
