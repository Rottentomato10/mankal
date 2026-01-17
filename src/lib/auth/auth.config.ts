import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"
import { prisma } from "@/lib/db/prisma"

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

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      // Create default categories for new users
      const userId = user.id
      if (userId) {
        await prisma.category.createMany({
          data: DEFAULT_CATEGORIES.map(cat => ({
            userId,
            name: cat.name,
            displayOrder: cat.displayOrder,
          })),
        })
      }
    },
  },
}
