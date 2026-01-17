'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await signIn('google', { callbackUrl })
    } catch (err) {
      console.error('Login error:', err)
      setError('שגיאה בהתחברות. נסה שוב.')
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsDemoLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        window.location.replace('/')
      } else {
        setError('שגיאה בכניסת דמו. נסה שוב.')
      }
    } catch (err) {
      console.error('Demo login error:', err)
      setError('שגיאה בכניסת דמו. נסה שוב.')
    } finally {
      setIsDemoLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '400px', padding: '0 20px' }}>
      <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'center' }}>
        {/* Logo */}
        <div style={{ marginBottom: '32px' }}>
          <span style={{
            color: 'var(--accent)',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px'
          }}>
            מבית פורשים כנף
          </span>
          <h1 style={{
            margin: 0,
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-1px'
          }}>
            מנכ"לים
          </h1>
          <p style={{
            color: 'var(--text-dim)',
            marginTop: '8px',
            fontSize: '0.95rem'
          }}>
            ניהול פיננסי חכם לצעירים
          </p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading || isDemoLoading}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: '16px',
            background: '#fff',
            border: 'none',
            color: '#333',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {isLoading ? 'מתחבר...' : 'כניסה עם Google'}
        </button>

        {/* Separator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '20px 0',
          gap: '16px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>או</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Demo Mode Button */}
        <button
          onClick={handleDemoLogin}
          disabled={isLoading || isDemoLoading}
          style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: '16px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            fontSize: '0.95rem',
            fontWeight: 500,
            cursor: isDemoLoading ? 'not-allowed' : 'pointer',
            opacity: isDemoLoading ? 0.7 : 1,
            transition: 'all 0.2s'
          }}
        >
          {isDemoLoading ? 'נכנס...' : 'נסה במצב דמו'}
        </button>

        <p style={{
          color: 'var(--expense)',
          marginTop: '12px',
          fontSize: '0.75rem',
          background: 'rgba(251, 113, 133, 0.1)',
          padding: '8px 12px',
          borderRadius: '8px'
        }}>
          שים לב: במצב דמו הנתונים לא נשמרים
        </p>

        {error && (
          <p style={{
            color: 'var(--expense)',
            marginTop: '16px',
            fontSize: '0.9rem'
          }}>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

function LoginFallback() {
  return (
    <div style={{ width: '100%', maxWidth: '400px', padding: '0 20px' }}>
      <div className="glass-card" style={{ padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '16px' }} />
        <div style={{ height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '32px', width: '60%', margin: '0 auto 32px' }} />
        <div style={{ height: '52px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px' }} />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
