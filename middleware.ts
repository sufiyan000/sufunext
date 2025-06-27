import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/app/lib/jwt';

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/api/auth/login', '/api/auth/signup'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get Authorization header (Bearer token)
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded: any = verifyAccessToken(token);

    // Inject user info into request (optional enhancement)
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-role', decoded.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/account/:path*',
    '/api/protected/:path*',
  ],
};
