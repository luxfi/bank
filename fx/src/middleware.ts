import { NextRequest, NextResponse } from 'next/server';

import { UserRole } from '@/models/auth';

import { getPaths, validatePaths } from '@/utils/pathPermissions';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(process.env.JWT_COOKIE ?? '');
  const user = request.cookies.get(process.env.CURRENT_USER_COOKIE ?? '');
  const userObj = user
    ? (JSON.parse(user.value) as { userId: string; role: UserRole })
    : null;

  if (!token && !getPaths('WITHOUT_AUTH').includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (
    token &&
    userObj &&
    getPaths('WITHOUT_AUTH').includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (
    token &&
    userObj &&
    validatePaths()[userObj.role]?.filter((d) =>
      request.nextUrl.pathname.startsWith(d)
    )?.length === 0
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|image/).*)'],
};
