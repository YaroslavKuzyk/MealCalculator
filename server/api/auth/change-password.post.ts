import { eq } from 'drizzle-orm'
import { db } from '../../db'
import { users } from '../../db/schema'
import { requireAuth, hashPassword, verifyPassword } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const authUser = await requireAuth(event)
  const { currentPassword, newPassword } = await readBody(event)

  if (!currentPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      message: 'Поточний та новий пароль обов\'язкові',
    })
  }

  if (newPassword.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'Новий пароль має містити щонайменше 6 символів',
    })
  }

  const [user] = await db.select().from(users).where(eq(users.id, authUser.id))

  if (!user || !verifyPassword(currentPassword, user.password)) {
    throw createError({
      statusCode: 401,
      message: 'Поточний пароль невірний',
    })
  }

  await db.update(users)
    .set({ password: hashPassword(newPassword) })
    .where(eq(users.id, user.id))

  return { success: true }
})
