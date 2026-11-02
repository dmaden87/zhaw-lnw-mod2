// Benutzer, Passwörter (scrypt) und Rollenprüfung für API-Routen
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { db } from './db';
import { readSession, ROLES } from './session';
import { UserError } from './errors';

export function hashPassword(pw) {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(pw, salt, 32).toString('hex')}`;
}
export function checkPassword(pw, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  const a = Buffer.from(hash, 'hex'); const b = scryptSync(pw, salt, 32);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Admin-Zugang: Benutzer «admin» mit ADMIN_PASSWORD (Vercel) – darf alles inkl. Benutzerverwaltung
export const BOOTSTRAP = { id: 0, username: 'admin', display_name: 'Admin', role: 'admin' };
export const ASSIGNABLE = ['user', 'superuser', 'kipm'];

// Prüft Sitzung und Mindestrolle; bei echten Benutzern zusätzlich, ob sie noch aktiv sind und welche Rolle sie aktuell haben
export async function requireRole(request, minRole) {
  const s = await readSession(request);
  if (!s) throw new UserError('Deine Anmeldung ist abgelaufen. Lade die Seite neu und melde dich erneut an.', 401);
  let user = { id: s.uid, username: s.u, display_name: s.n, role: s.r };
  if (s.uid !== 0) {
    const [row] = await db().query('SELECT id, username, display_name, role, active FROM users WHERE id = $1', [s.uid]);
    if (!row || !row.active) throw new UserError('Dein Benutzer ist gesperrt. Wende dich an den KI-PM.', 403);
    user = row;
  }
  if (ROLES[user.role] < ROLES[minRole]) throw new UserError('Dafür fehlt dir die Berechtigung.', 403);
  return user;
}
