// Signierte Sitzung im Cookie (HMAC-SHA256). Läuft im Proxy und in den API-Routen.
export const SESSION_COOKIE = 'session';
export const ROLES = { user: 1, superuser: 2, kipm: 3 };
export const ROLE_LABEL = { user: 'User', superuser: 'Super-User', kipm: 'KI-PM' };
const MAX_AGE = 60 * 60 * 12; // 12 Stunden

const enc = new TextEncoder();
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function key() {
  const secret = process.env.SESSION_SECRET || process.env.DEMO_PASSWORD;
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function signSession(user) {
  const payload = b64(enc.encode(JSON.stringify({ uid: user.id, u: user.username, n: user.display_name, r: user.role, exp: Math.floor(Date.now() / 1000) + MAX_AGE })));
  const sig = b64(await crypto.subtle.sign('HMAC', await key(), enc.encode(payload)));
  return `${payload}.${sig}`;
}

export async function readSession(request) {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  if (!raw || !raw.includes('.')) return null;
  const [payload, sig] = raw.split('.');
  try {
    const ok = await crypto.subtle.verify('HMAC', await key(), unb64(sig), enc.encode(payload));
    if (!ok) return null;
    const s = JSON.parse(new TextDecoder().decode(unb64(payload)));
    return s.exp > Date.now() / 1000 ? s : null;
  } catch {
    return null;
  }
}

export const cookieOptions = { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: MAX_AGE };
