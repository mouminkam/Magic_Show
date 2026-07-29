import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  const pathname = request.nextUrl.pathname;

  // Canonical cart route: redirect legacy /shoping-cart to /cart
  if (pathname === '/shoping-cart' || pathname.startsWith('/shoping-cart/')) {
    return NextResponse.redirect(new URL('/cart', request.url));
  }

  // Protected routes
  const protectedRoutes = ['/cart', '/shoping-cart', '/checkout', '/profile', '/wishlist'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check localStorage token on client-side for auth routes
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    // Let client-side handle redirect if already logged in
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cart',
    '/cart/:path*',
    '/shoping-cart',
    '/shoping-cart/:path*',
    '/checkout/:path*',
    '/profile/:path*',
    '/wishlist/:path*',
    '/login',
    '/register'
  ],
};
