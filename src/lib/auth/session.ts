import { cookies } from 'next/headers'
import { auth } from "./auth"

const DEMO_COOKIE_NAME = 'ceos-demo-session'
const DEMO_USER_ID = 'demo-user-001'

interface DemoSessionData {
  userId: string
  email: string
  name: string
  isDemo: boolean
  createdAt: number
}

/**
 * Get demo session from cookie
 */
async function getDemoSession(): Promise<DemoSessionData | null> {
  try {
    const cookieStore = await cookies()
    const demoCookie = cookieStore.get(DEMO_COOKIE_NAME)

    if (!demoCookie?.value) {
      return null
    }

    const decoded = Buffer.from(demoCookie.value, 'base64').toString('utf-8')
    const session = JSON.parse(decoded) as DemoSessionData

    // Check if session is expired (7 days)
    const sessionAge = Date.now() - session.createdAt
    if (sessionAge > 7 * 24 * 60 * 60 * 1000) {
      return null
    }

    return session
  } catch {
    return null
  }
}

/**
 * Get the current user ID from NextAuth session or demo session
 */
export async function getCurrentUserId(): Promise<string | null> {
  // Check NextAuth session first
  const session = await auth()
  if (session?.user?.id) {
    return session.user.id
  }

  // Fall back to demo session
  const demoSession = await getDemoSession()
  if (demoSession?.userId) {
    return demoSession.userId
  }

  return null
}

/**
 * Get the current session (NextAuth or demo)
 */
export async function getSession() {
  const session = await auth()
  if (session) {
    return session
  }

  const demoSession = await getDemoSession()
  if (demoSession) {
    return {
      user: {
        id: demoSession.userId,
        email: demoSession.email,
        name: demoSession.name,
      },
      isDemo: true,
    }
  }

  return null
}

/**
 * Check if user is in demo mode
 */
export async function isInDemoMode(): Promise<boolean> {
  const session = await auth()
  if (session) {
    return false // Real user logged in via NextAuth
  }

  const demoSession = await getDemoSession()
  return demoSession !== null
}

/**
 * Check if user is authenticated (either NextAuth or demo)
 */
export async function isAuthenticated(): Promise<boolean> {
  const userId = await getCurrentUserId()
  return userId !== null
}

/**
 * Destroy demo session
 */
export async function destroyDemoSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(DEMO_COOKIE_NAME)
}

/**
 * Create demo session for a user
 */
export async function createSession(user: { id: string; email: string | null; name: string | null }): Promise<void> {
  const cookieStore = await cookies()

  const sessionData: DemoSessionData = {
    userId: user.id,
    email: user.email || 'demo@ceos.app',
    name: user.name || 'משתמש',
    isDemo: true,
    createdAt: Date.now(),
  }

  const encoded = Buffer.from(JSON.stringify(sessionData)).toString('base64')

  cookieStore.set(DEMO_COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: false, // Allow HTTP for localhost testing
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  })
}
