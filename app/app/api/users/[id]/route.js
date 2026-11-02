// Benutzer ändern (nur Admin): Rolle, Name, sperren/entsperren, Passwort zurücksetzen
import { db } from '../../../../lib/db';
import { requireRole, hashPassword, ASSIGNABLE } from '../../../../lib/users';
import { UserError, errorResponse } from '../../../../lib/errors';

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const me = await requireRole(request, 'admin');
    const id = Number((await params).id);
    const b = await request.json().catch(() => ({}));
    const sql = db();
    const [u] = await sql.query('SELECT id, role, active FROM users WHERE id = $1', [id]);
    if (!u) throw new UserError('Diesen Benutzer gibt es nicht mehr. Lade die Seite neu.', 404);
    if (b.role !== undefined && !ASSIGNABLE.includes(b.role)) throw new UserError('Wähle die Rolle User, Super-User oder KI-PM.');
    if (b.password !== undefined && String(b.password).length < 8) throw new UserError('Das Passwort braucht mindestens 8 Zeichen.');
    if (me.id === id && (b.active === false || (b.role && b.role !== 'kipm'))) throw new UserError('Du kannst dich nicht selbst sperren oder herabstufen.');
    const [row] = await sql.query(
      `UPDATE users SET role = COALESCE($2, role), active = COALESCE($3, active), display_name = COALESCE($4, display_name),
              password_hash = COALESCE($5, password_hash)
        WHERE id = $1 RETURNING id, username, display_name, role, active, created_at, last_login, created_by`,
      [id, b.role ?? null, typeof b.active === 'boolean' ? b.active : null, b.display_name?.trim() || null, b.password ? hashPassword(b.password) : null]);
    return Response.json(row);
  } catch (e) { return errorResponse(e, 'users-update'); }
}
