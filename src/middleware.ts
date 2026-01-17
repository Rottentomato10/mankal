import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DEMO_COOKIE_NAME = 'ceos-demo-session'
const NEXTAUTH_COOKIE_NAME = 'authjs.session-token' // NextAuth v5 cookie name

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/api/auth']

// Routes that should redirect to home if already authenticated
const AUTH_ROUTES = ['/login']

function isAuthenticated(request: NextRequest): boolean {
  // Check for NextAuth session
  const nextAuthCookie = request.cookies.get(NEXTAUTH_COOKIE_NAME) ||
                         request.cookies.get('__Secure-authjs.session-token') // Production cookie
  if (nextAuthCookie?.value) {
    return true
  }

  // Check for demo session
  const demoCookie = request.cookies.get(DEMO_COOKIE_NAME)
  if (demoCookie?.value) {
    return true
  }

  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authenticated = isAuthenticated(request)

  // Allow all auth API routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Skip API routes for non-auth endpoints
  if (pathname.startsWith('/api/')) {
    // For protected API routes, check authentication
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    // Redirect authenticated users away from auth pages
    if (authenticated && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Protect all other routes
  if (!authenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)',
  ],
}
