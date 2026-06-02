import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users } from '../../db/schema'
import { generateSessionId, setSession, verifyPassword } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email та пароль обов\'язкові',
    })
  }

  const [user] = await db.select().from(users).where(eq(users.email, email))

  if (!user || !verifyPassword(password, user.password)) {
    throw createError({
      statusCode: 401,
      message: 'Невірні дані',
    })
  }

  const sessionId = generateSessionId()
  setSession(sessionId, user.id)

  setCookie(event, 'session', sessionId, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  })

  return { id: user.id, email: user.email, dailyCalorieGoal: user.dailyCalorieGoal }
})
