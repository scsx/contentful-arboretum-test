import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en-US', 'pt', 'pt-BR'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Verifica se começa com um locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locales[0]}`
  );

  if (pathnameHasLocale) {
    // Remove o locale e redireciona
    const segments = pathname.split('/');
    const newPathname = '/' + segments.slice(2).join('/');

    return NextResponse.redirect(new URL(newPathname || '/', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};