import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Match all routes - this forces Next.js to treat them as dynamic
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
