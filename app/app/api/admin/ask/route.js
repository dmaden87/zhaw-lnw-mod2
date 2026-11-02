// Test-Endpunkt mit Diagnosedaten (Suchtreffer, Scores, Zeiten): ?q=...&level=instant|basic|full
import { answer } from '../../../../lib/answer';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request) {
  const p = request.nextUrl.searchParams;
  try {
    return Response.json(await answer(p.get('q') || '', p.get('level') || 'basic'));
  } catch (e) {
    return Response.json({ error: String(e.message || e) }, { status: 500 });
  }
}
