// Hilfsfunktionen für Tests: Anfragen mit oder ohne Sitzung bauen
import { NextRequest } from 'next/server';
import { signSession, SESSION_COOKIE } from '../lib/session';

export async function cookieFor(user) {
  return `${SESSION_COOKIE}=${await signSession(user)}`;
}

export async function req(path, { user, method = 'GET', body, form, headers = {} } = {}) {
  const h = new Headers(headers);
  if (user) h.set('cookie', await cookieFor(user));
  let payload;
  if (form) { payload = new URLSearchParams(form); h.set('content-type', 'application/x-www-form-urlencoded'); }
  else if (body !== undefined) { payload = JSON.stringify(body); h.set('content-type', 'application/json'); }
  return new NextRequest(new URL(path, 'https://briefing.test'), { method, headers: h, body: payload });
}

export const ADMIN = { id: 0, username: 'admin', display_name: 'Admin', role: 'admin' };
export const dbUser = (role, extra = {}) => ({ id: 7, username: `${role}01`, display_name: `Test ${role}`, role, active: true, ...extra });
