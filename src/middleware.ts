import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;
  
  const publicRoutes = ['/login', '/signup'];

  const isPublicRoute = publicRoutes.some(route => pathname === route);

  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isPublicRoute) {
    const jobsUrl = new URL('/jobs', req.url);
    return NextResponse.redirect(jobsUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|briefcase.png|public/).*)',
  ],
};