import { NextResponse } from 'next/server';
import { authToken, COOKIE } from './lib-auth';

// Einfacher Passwortschutz für die Demo: Login-Seite + Cookie.
// Passwort = Umgebungsvariable DEMO_PASSWORD (in Vercel gesetzt, nie im Code).
// Zulässig, weil die App ausschliesslich fiktive Daten der Gletscherbank AG enthält.
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  if (pathname === '/login' || pathname === '/api/login') return NextResponse.next();

  const password = process.env.DEMO_PASSWORD;
  if (!password) return new NextResponse('DEMO_PASSWORD ist nicht gesetzt.', { status: 503 });

  const cookie = request.cookies.get(COOKIE)?.value;
  if (cookie && cookie === (await authToken(password))) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
