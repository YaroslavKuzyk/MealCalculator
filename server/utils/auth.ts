import type { H3Event } from 'h3'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'

const sessions = new Map<string, number>()

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function setSession(sessionId: string, userId: number) {
  sessions.set(sessionId, userId)
}

export function getSession(sessionId: string): number | undefined {
  return sessions.get(sessionId)
}

export function deleteSession(sessionId: string) {
  sessions.delete(sessionId)
}

export function getUserFromEvent(event: H3Event) {
  const sessionId = getCookie(event, 'session')
  if (!sessionId) return null

  const userId = getSession(sessionId)
  if (!userId) return null

  const user = db.select({
    id: users.id,
    email: users.email,
    dailyCalorieGoal: users.dailyCalorieGoal,
  }).from(users).where(eq(users.id, userId)).get()

  return user
}

export function requireAuth(event: H3Event) {
  const user = getUserFromEvent(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }
  return user
}
