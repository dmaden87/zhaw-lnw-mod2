// Benutzerverwaltung (nur KI-PM): Liste und neuen Benutzer anlegen
import { db } from '../../../lib/db';
import { requireRole, hashPassword } from '../../../lib/users';
import { UserError, errorResponse } from '../../../lib/errors';
import { ROLES } from '../../../lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await requireRole(request, 'kipm');
    return Response.json(await db().query('SELECT id, username, display_name, role, active, created_at, last_login, created_by FROM users ORDER BY username'));
  } catch (e) { return errorResponse(e, 'users-list'); }
}

export async function POST(request) {
  try {
    const me = await requireRole(request, 'kipm');
    const b = await request.json().catch(() => ({}));
    const username = String(b.username || '').trim().toLowerCase();
    const name = String(b.display_name || '').trim();
    if (!/^[a-z0-9._-]{3,30}$/.test(username)) throw new UserError('Der Benutzername braucht 3–30 Zeichen: Kleinbuchstaben, Ziffern, Punkt, Bindestrich oder Unterstrich.');
    if (username === 'admin') throw new UserError('«admin» ist für den Start-Zugang reserviert.');
    if (!name) throw new UserError('Gib einen Anzeigenamen ein.');
    if (!ROLES[b.role]) throw new UserError('Wähle eine Rolle.');
    if (String(b.password || '').length < 8) throw new UserError('Das Passwort braucht mindestens 8 Zeichen.');
    const [exists] = await db().query('SELECT id FROM users WHERE username = $1', [username]);
    if (exists) throw new UserError(`Den Benutzernamen «${username}» gibt es schon.`, 409);
    const [row] = await db().query(
      `INSERT INTO users (username, display_name, role, password_hash, created_by) VALUES ($1,$2,$3,$4,$5)
       RETURNING id, username, display_name, role, active, created_at, last_login, created_by`,
      [username, name, b.role, hashPassword(b.password), me.username]);
    return Response.json(row);
  } catch (e) { return errorResponse(e, 'users-create'); }
}
