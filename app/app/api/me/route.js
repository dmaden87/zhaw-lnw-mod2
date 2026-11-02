import { readSession, ROLE_LABEL } from '../../../lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const s = await readSession(request);
  if (!s) return Response.json({ error: 'Nicht angemeldet.' }, { status: 401 });
  return Response.json({ id: s.uid, username: s.u, name: s.n, role: s.r, roleLabel: ROLE_LABEL[s.r] });
}
