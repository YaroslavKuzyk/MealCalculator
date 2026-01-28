import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users } from '../../db/schema'
import { generateSessionId, setSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email та пароль обов\'язкові',
    })
  }

  const existing = db.select().from(users).where(eq(users.email, email)).get()
  if (existing) {
    throw createError({
      statusCode: 400,
      message: 'Користувач вже існує',
    })
  }

  const hashedPassword = Buffer.from(password).toString('base64')

  const result = db.insert(users).values({
    email,
    password: hashedPassword,
  }).returning().get()

  const sessionId = generateSessionId()
  setSession(sessionId, result.id)

  setCookie(event, 'session', sessionId, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  })

  return { id: result.id, email: result.email, dailyCalorieGoal: result.dailyCalorieGoal }
})
