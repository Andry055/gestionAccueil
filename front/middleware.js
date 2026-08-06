import { NextResponse } from 'next/server';

const protectedRoutes = [
  '/home',
  '/visiteur',
  '/visite',
  '/service',
  '/about',
  '/superAdmin',
];

const publicRoutes = ['/', '/register'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  // Rediriger vers /home SEULEMENT si le user est vraiment connecté (auth_token + user_role + session valide)
  if (authToken && userRole && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  if (isProtected && !authToken) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|herbe.avif).*)'],
};
