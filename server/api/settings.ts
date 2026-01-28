import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const method = event.method

  if (method === 'GET') {
    return { dailyCalorieGoal: user.dailyCalorieGoal }
  }

  if (method === 'POST') {
    const { dailyCalorieGoal } = await readBody(event)

    db.update(users)
      .set({ dailyCalorieGoal })
      .where(eq(users.id, user.id))
      .run()

    return { dailyCalorieGoal }
  }
})
