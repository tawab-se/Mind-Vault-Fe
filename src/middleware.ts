import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/accept-invite',
];

// Define auth routes that logged-in users shouldn't access
const authRoutes = ['/', '/auth/login', '/auth/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = !!token;

  // Check if the current path is public (exact match for '/', startsWith for others)
  const isPublicRoute = publicRoutes.some((route) =>
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  );

  // Check if the current path is an auth route (exact match for '/', startsWith for others)
  const isAuthRoute = authRoutes.some((route) =>
    route === '/' ? pathname === '/' : pathname.startsWith(route)
  );

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login (except for public routes)
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/auth/login', request.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes should run middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
