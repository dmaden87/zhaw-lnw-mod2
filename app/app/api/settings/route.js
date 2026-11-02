// Einstellungen und Zähler der Schutzmechanismen (nur Admin)
import { db } from '../../../lib/db';
import { requireRole } from '../../../lib/users';
import { getSettings, setSetting } from '../../../lib/settings';
import { CATEGORIES } from '../../../lib/guard';
import { UserError, errorResponse } from '../../../lib/errors';

export const dynamic = 'force-dynamic';

async function counters() {
  const rows = await db().query(
    `SELECT category,
            sum(count)::int AS total,
            sum(count) FILTER (WHERE day >= current_date - 6)::int AS last7,
            sum(count) FILTER (WHERE day = current_date)::int AS today
       FROM guard_counts GROUP BY category`).catch(() => []);
  const by = Object.fromEntries(rows.map((r) => [r.category, r]));
  return Object.entries(CATEGORIES).map(([key, label]) => ({ key, label, today: by[key]?.today || 0, last7: by[key]?.last7 || 0, total: by[key]?.total || 0 }));
}

export async function GET(request) {
  try {
    await requireRole(request, 'admin');
    return Response.json({ settings: await getSettings(true), counters: await counters() });
  } catch (e) { return errorResponse(e, 'settings-get'); }
}

export async function PATCH(request) {
  try {
    const me = await requireRole(request, 'admin');
    const b = await request.json().catch(() => ({}));
    if (typeof b.general_knowledge !== 'boolean') throw new UserError('Ungültige Einstellung.');
    return Response.json({ settings: await setSetting('general_knowledge', b.general_knowledge, me.username), counters: await counters() });
  } catch (e) { return errorResponse(e, 'settings-set'); }
}
