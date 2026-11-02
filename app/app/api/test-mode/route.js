// Testing- und Adjustment-Modus ein-/ausschalten. Einschalten nur mit dem Demo-Passwort.
import { NextResponse } from 'next/server';
import { TEST_COOKIE, testToken, isTestMode } from '../../../lib-auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  return Response.json({ active: await isTestMode(request) });
}

export async function POST(request) {
  const { password } = await request.json().catch(() => ({}));
  if (!process.env.DEMO_PASSWORD || password !== process.env.DEMO_PASSWORD) {
    return Response.json({ error: 'Passwort falsch. Der Testing-Modus bleibt ausgeschaltet.' }, { status: 403 });
  }
  const res = NextResponse.json({ active: true });
  res.cookies.set(TEST_COOKIE, await testToken(password), { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ active: false });
  res.cookies.set(TEST_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
