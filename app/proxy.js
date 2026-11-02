import { NextResponse } from 'next/server';
import { authToken, COOKIE } from './lib-auth';

// Einfacher Passwortschutz für die Demo: Login-Seite + Cookie.
// Passwort = Umgebungsvariable DEMO_PASSWORD (in Vercel gesetzt, nie im Code).
// Zulässig, weil die App ausschliesslich fiktive Daten der Gletscherbank AG enthält.
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  if (pathname === '/login' || pathname === '/api/login') return NextResponse.next();

  // Admin-Endpunkte (Modellprüfung, Import): Zugang über ADMIN_TOKEN statt Login,
  // damit sie automatisiert aufgerufen werden können. Token nur in Vercel gesetzt.
  if (pathname.startsWith('/api/admin/')) {
    const token = process.env.ADMIN_TOKEN;
    const given = request.nextUrl.searchParams.get('token') || request.headers.get('x-admin-token');
    if (token && given === token) return NextResponse.next();
    return new NextResponse('Nicht berechtigt.', { status: 401 });
  }

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
  matcher: ['/((?!_next/static|_next/image|_vercel|favicon.ico).*)'],
};
