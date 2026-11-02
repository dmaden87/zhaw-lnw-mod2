import { NextResponse } from 'next/server';
import { authToken, COOKIE } from '../../../lib-auth';

export async function POST(request) {
  const form = await request.formData();
  const given = String(form.get('password') || '');
  const password = process.env.DEMO_PASSWORD;
  if (!password || given !== password) {
    return NextResponse.redirect(new URL('/login?fehler=1', request.url), 303);
  }
  const res = NextResponse.redirect(new URL('/', request.url), 303);
  res.cookies.set(COOKIE, await authToken(password), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
