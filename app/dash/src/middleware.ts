import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/registration',
  '/registration/success',
  '/forgot-password',
  '/2fa',
]

// Static asset prefixes to skip
const SKIP_PREFIXES = ['/api', '/_next', '/image', '/images', '/fonts', '/favicon.ico']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static assets and API routes
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Allow public auth routes
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for JWT session cookie
  const jwtCookie = request.cookies.get(
    process.env.NEXT_PUBLIC_JWT_COOKIE || 'lux-jwt-session'
  )

  // No session → redirect to login
  if (!jwtCookie?.value) {
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Has session → allow through
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
