import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Demo user for development/testing
const DEMO_USER = {
  id: 'demo-user-001',
  email: 'demo@ceos.app',
  name: 'משתמש דמו',
}

// Default 8 expense categories in Hebrew
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

// Sample transactions for demo (optional, for testing)
const SAMPLE_TRANSACTIONS = [
  {
    type: 'EXPENSE',
    amount: 45.5,
    paymentMethod: 'CARD',
    description: 'ארוחת צהריים',
    categoryIndex: 0, // אוכל
    daysAgo: 0,
  },
  {
    type: 'EXPENSE',
    amount: 15.0,
    paymentMethod: 'CASH',
    description: 'אוטובוס',
    categoryIndex: 1, // תחבורה
    daysAgo: 1,
  },
  {
    type: 'EXPENSE',
    amount: 120.0,
    paymentMethod: 'CARD',
    description: 'קולנוע ומסעדה',
    categoryIndex: 2, // בילויים
    daysAgo: 2,
  },
  {
    type: 'INCOME',
    amount: 5000.0,
    source: 'משכורת',
    description: 'משכורת חודשית',
    daysAgo: 5,
  },
  {
    type: 'INCOME',
    amount: 200.0,
    source: 'מתנה',
    description: 'מתנה מסבתא',
    daysAgo: 10,
  },
  {
    type: 'EXPENSE',
    amount: 350.0,
    paymentMethod: 'CARD',
    description: 'ביגוד חדש',
    categoryIndex: 3, // קניות
    daysAgo: 7,
  },
  {
    type: 'EXPENSE',
    amount: 250.0,
    paymentMethod: 'CARD',
    description: 'חשבון חשמל',
    categoryIndex: 4, // חשבונות
    daysAgo: 15,
  },
]

async function main() {
  console.log('Seeding database...')

  // Create or update demo user
  const user = await prisma.user.upsert({
    where: { id: DEMO_USER.id },
    update: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
    },
    create: {
      id: DEMO_USER.id,
      email: DEMO_USER.email,
      name: DEMO_USER.name,
    },
  })

  console.log(`Demo user created/updated: ${user.name} (${user.email})`)

  // Create default categories for demo user
  const categories = []
  for (const cat of DEFAULT_CATEGORIES) {
    const category = await prisma.category.upsert({
      where: {
        id: `${DEMO_USER.id}-cat-${cat.displayOrder}`,
      },
      update: {
        name: cat.name,
        displayOrder: cat.displayOrder,
        isArchived: false,
      },
      create: {
        id: `${DEMO_USER.id}-cat-${cat.displayOrder}`,
        userId: DEMO_USER.id,
        name: cat.name,
        displayOrder: cat.displayOrder,
        isArchived: false,
      },
    })
    categories.push(category)
    console.log(`Category created/updated: ${category.name}`)
  }

  // Check if we should seed sample transactions
  const existingTransactions = await prisma.transaction.count({
    where: { userId: DEMO_USER.id },
  })

  if (existingTransactions === 0) {
    console.log('Creating sample transactions...')

    for (const tx of SAMPLE_TRANSACTIONS) {
      const date = new Date()
      date.setDate(date.getDate() - tx.daysAgo)

      await prisma.transaction.create({
        data: {
          userId: DEMO_USER.id,
          type: tx.type,
          amount: tx.amount,
          date: date,
          paymentMethod: tx.paymentMethod || null,
          source: tx.source || null,
          description: tx.description,
          categoryId: tx.categoryIndex !== undefined ? categories[tx.categoryIndex].id : null,
        },
      })

      console.log(`Transaction created: ${tx.type} ${tx.amount}`)
    }
  } else {
    console.log(`Skipping sample transactions (${existingTransactions} existing)`)
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
