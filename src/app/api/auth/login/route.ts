import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { createSession } from '@/lib/auth/session'

// Demo user ID - matches seed.ts
const DEMO_USER_ID = 'demo-user-001'

/**
 * POST /api/auth/login
 * Demo mode: Creates session for demo user
 * In production, this would handle Google OAuth callback
 */
export async function POST() {
  try {
    // Find or create demo user
    let user = await prisma.user.findUnique({
      where: { id: DEMO_USER_ID },
    })

    if (!user) {
      // Create demo user if not exists (shouldn't happen if seeded)
      user = await prisma.user.create({
        data: {
          id: DEMO_USER_ID,
          email: 'demo@ceos.app',
          name: 'משתמש דמו',
        },
      })
    }

    // Create session
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    )
  }
}
