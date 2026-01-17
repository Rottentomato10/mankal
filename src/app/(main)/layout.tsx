'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { AuthProvider, useAuthContext } from '@/components/providers/AuthProvider'

function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'בית', icon: '🏠' },
    { href: '/dashboard', label: 'דשבורד', icon: '📊' },
    { href: '/categories', label: 'קטגוריות', icon: '📁' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--card-bg)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      padding: '12px 0',
      paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '480px', margin: '0 auto' }}>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              textDecoration: 'none',
              color: pathname === item.href ? 'var(--accent)' : 'var(--text-dim)',
              fontSize: '0.75rem',
              fontWeight: pathname === item.href ? 600 : 400,
              transition: 'color 0.2s'
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '32px', height: '32px', border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-dim)' }}>טוען...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - will redirect
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedContent>
        <main style={{ minHeight: '100vh', paddingBottom: '80px' }}>
          {children}
        </main>
        <BottomNav />
      </ProtectedContent>
    </AuthProvider>
  )
}
