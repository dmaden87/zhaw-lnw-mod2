import { NextResponse } from 'next/server';
import { readSession } from './lib/session';

// Zugangsschutz: alle Seiten und APIs nur mit gültiger Sitzung (Rollen prüfen die einzelnen Routen).
// Admin-Endpunkte (Import, Tests, Export) über ADMIN_TOKEN, damit sie automatisiert laufen können.
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  if (pathname === '/login' || pathname === '/api/login') return NextResponse.next();

  if (pathname.startsWith('/api/admin/')) {
    const token = process.env.ADMIN_TOKEN;
    const given = request.nextUrl.searchParams.get('token') || request.headers.get('x-admin-token');
    if (token && given === token) return NextResponse.next();
    return new NextResponse('Nicht berechtigt.', { status: 401 });
  }

  if (await readSession(request)) return NextResponse.next();
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Deine Anmeldung ist abgelaufen. Lade die Seite neu und melde dich erneut an.' }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|_vercel|favicon.ico).*)'],
};
