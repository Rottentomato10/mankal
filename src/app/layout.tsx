import type { Metadata, Viewport } from 'next'
import './globals.css'
import AccessibilityWidget from '@/components/AccessibilityWidget'

export const metadata: Metadata = {
  title: 'מנכ"לים - ניהול פיננסי',
  description: 'אפליקציה לניהול הוצאות והכנסות אישיות',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'מנכ"לים',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-background text-white antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:rounded-full focus:bg-[var(--accent)] focus:px-6 focus:py-3 focus:text-black"
        >
          דלגו לתוכן המרכזי
        </a>
        <div id="main-content">{children}</div>
        <AccessibilityWidget />
      </body>
    </html>
  )
}
