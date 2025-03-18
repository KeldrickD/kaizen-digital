import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

// This middleware will run on specific routes
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    path === '/auth/signin' ||
    path === '/auth/error' ||
    path === '/auth/signout';
  
  // Check if the path is an admin route
  const isAdminPath = path.startsWith('/admin');
  
  if (!isAdminPath && !isPublicPath) {
    // Not an admin path or auth path, no need to check auth
    return NextResponse.next();
  }
  
  // For admin paths, check if the user is authenticated
  if (isAdminPath) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // If no token or not an admin, redirect to sign in
    if (!token || token.role !== 'admin') {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }
  
  // User is authenticated with admin role or accessing public path
  return NextResponse.next();
}

// Add all admin paths and auth paths to the config
export const config = {
  matcher: ['/admin/:path*', '/auth/:path*']
}; 