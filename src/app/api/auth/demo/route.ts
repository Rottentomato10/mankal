import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const DEMO_USER_ID = 'demo-user-001'
const DEMO_COOKIE_NAME = 'ceos-demo-session'
const DEMO_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function POST() {
  try {
    const cookieStore = await cookies()

    // Create demo session cookie
    const sessionData = {
      userId: DEMO_USER_ID,
      email: 'demo@ceos.app',
      name: 'משתמש דמו',
      isDemo: true,
      createdAt: Date.now(),
    }

    cookieStore.set(DEMO_COOKIE_NAME, Buffer.from(JSON.stringify(sessionData)).toString('base64'), {
      httpOnly: true,
      secure: false, // Allow HTTP for localhost testing
      sameSite: 'lax',
      maxAge: DEMO_COOKIE_MAX_AGE,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: DEMO_USER_ID,
        email: 'demo@ceos.app',
        name: 'משתמש דמו',
      },
    })
  } catch (error) {
    console.error('Demo login error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    )
  }
}
