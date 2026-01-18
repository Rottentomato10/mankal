import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getCurrentUserId } from '@/lib/auth/session'

const DEFAULT_CATEGORIES = [
  { name: 'אוכל', displayOrder: 1 },
  { name: 'תחבורה', displayOrder: 2 },
  { name: 'בילויים', displayOrder: 3 },
  { name: 'קניות', displayOrder: 4 },
  { name: 'חשבונות', displayOrder: 5 },
  { name: 'בריאות', displayOrder: 6 },
  { name: 'לימודים', displayOrder: 7 },
  { name: 'אחר', displayOrder: 8 },
]

/**
 * GET /api/categories
 * Returns all active categories for the current user
 * Creates default categories if user has none
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let categories = await prisma.category.findMany({
      where: {
        userId,
        isArchived: false,
      },
      orderBy: {
        displayOrder: 'asc',
      },
      select: {
        id: true,
        name: true,
        displayOrder: true,
      },
    })

    // If user has no categories, create default ones
    if (categories.length === 0) {
      console.log(`Creating default categories for user: ${userId}`)
      await prisma.category.createMany({
        data: DEFAULT_CATEGORIES.map(cat => ({
          userId,
          name: cat.name,
          displayOrder: cat.displayOrder,
        })),
      })

      // Fetch the newly created categories
      categories = await prisma.category.findMany({
        where: {
          userId,
          isArchived: false,
        },
        orderBy: {
          displayOrder: 'asc',
        },
        select: {
          id: true,
          name: true,
          displayOrder: true,
        },
      })
    }

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
