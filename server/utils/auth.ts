import type { H3Event } from 'h3'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
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

// Password hashing (scrypt with per-user salt). Stored as "salt:hash".
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(':')
  if (!salt || !key) return false
  const hashedBuffer = scryptSync(password, salt, 64)
  const keyBuffer = Buffer.from(key, 'hex')
  if (keyBuffer.length !== hashedBuffer.length) return false
  return timingSafeEqual(hashedBuffer, keyBuffer)
}

export async function getUserFromEvent(event: H3Event) {
  const sessionId = getCookie(event, 'session')
  if (!sessionId) return null

  const userId = getSession(sessionId)
  if (!userId) return null

  const [user] = await db.select({
    id: users.id,
    email: users.email,
    dailyCalorieGoal: users.dailyCalorieGoal,
  }).from(users).where(eq(users.id, userId))

  return user ?? null
}

export async function requireAuth(event: H3Event) {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }
  return user
}
