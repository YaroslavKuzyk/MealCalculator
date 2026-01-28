import { deleteSession } from '../../utils/auth'

export default defineEventHandler((event) => {
  const sessionId = getCookie(event, 'session')
  if (sessionId) {
    deleteSession(sessionId)
  }

  deleteCookie(event, 'session')

  return { success: true }
})
