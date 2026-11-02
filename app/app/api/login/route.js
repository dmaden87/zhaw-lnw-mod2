import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { signSession, SESSION_COOKIE, cookieOptions } from '../../../lib/session';
import { checkPassword, BOOTSTRAP } from '../../../lib/users';

const back = (request, fehler) => NextResponse.redirect(new URL(`/login?fehler=${fehler}`, request.url), 303);

export async function POST(request) {
  const form = await request.formData();
  const username = String(form.get('username') || '').trim().toLowerCase();
  const password = String(form.get('password') || '');
  if (!username || !password) return back(request, 'leer');

  let user = null;
  if (username === 'admin') {
    if (process.env.DEMO_PASSWORD && password === process.env.DEMO_PASSWORD) user = BOOTSTRAP;
  } else {
    try {
      const [row] = await db().query('SELECT id, username, display_name, role, active, password_hash FROM users WHERE username = $1', [username]);
      if (row && !row.active) return back(request, 'gesperrt');
      if (row && checkPassword(password, row.password_hash)) {
        user = row;
        await db().query('UPDATE users SET last_login = now() WHERE id = $1', [row.id]);
      }
    } catch {
      return back(request, 'technik');
    }
  }
  if (!user) return back(request, 'falsch');
  const res = NextResponse.redirect(new URL('/', request.url), 303);
  res.cookies.set(SESSION_COOKIE, await signSession(user), cookieOptions);
  res.cookies.set('demo_auth', '', { path: '/', maxAge: 0 }); // altes Cookie aufräumen
  return res;
}
