// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('admin_token');
  
  // Check if the path is an admin route and not the login page
  if (
    request.nextUrl.pathname.startsWith('/x7k9m2') &&
    !request.nextUrl.pathname.includes('/x7k9m2/login')
  ) {
    // Redirect to login if no token is found
    if (!token) {
      return NextResponse.redirect(new URL('/x7k9m2/login', request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure the paths that should invoke this middleware
export const config = {
  matcher: ['/x7k9m2/:path*'],
};