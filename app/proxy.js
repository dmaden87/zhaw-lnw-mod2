import { NextResponse } from 'next/server';

// Einfacher Passwortschutz für die Demo (HTTP Basic Auth).
// Benutzername beliebig, Passwort = Umgebungsvariable DEMO_PASSWORD (in Vercel gesetzt, nie im Code).
// Zulässig, weil die App ausschliesslich fiktive Daten der Gletscherbank AG enthält.
export function proxy(request) {
  const password = process.env.DEMO_PASSWORD;
  if (!password) {
    return new NextResponse('DEMO_PASSWORD ist nicht gesetzt.', { status: 503 });
  }
  const header = request.headers.get('authorization') || '';
  if (header.startsWith('Basic ')) {
    const decoded = atob(header.slice(6));
    const given = decoded.slice(decoded.indexOf(':') + 1);
    if (given === password) return NextResponse.next();
  }
  return new NextResponse('Anmeldung erforderlich.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Briefing-Bot Demo", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
