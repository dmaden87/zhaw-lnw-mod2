import { answer } from '../../../lib/answer';
import { readSession } from '../../../lib/session';
import { rateLimited, count, RATE_LIMIT } from '../../../lib/guard';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request) {
  const { question, level } = await request.json().catch(() => ({}));
  if (!question || !question.trim()) return Response.json({ error: 'Bitte eine Frage eingeben.' }, { status: 400 });
  // Missbrauch begrenzen: drei Stufen pro Frage, also 3 × RATE_LIMIT Anfragen pro 10 Minuten
  const s = await readSession(request);
  if (rateLimited(String(s?.uid ?? 'anon'), Date.now(), 3 * RATE_LIMIT)) {
    if (level === 'basic') await count('rate_limit');
    return Response.json({ error: `Du hast in den letzten 10 Minuten mehr als ${RATE_LIMIT} Fragen gestellt. Warte kurz und versuche es dann nochmals.` }, { status: 429 });
  }
  try {
    const result = await answer(question.trim().slice(0, 1000), level);
    delete result.debug;
    return Response.json(result);
  } catch (e) {
    console.error('[ask]', e);
    const busy = /429|503|overloaded|high demand/i.test(String(e.message));
    return Response.json({ error: busy
      ? 'Der KI-Dienst ist gerade ausgelastet. Versuche es in einer Minute nochmals.'
      : 'Die Antwort konnte nicht erzeugt werden. Versuche es nochmals; falls es wieder passiert, melde dich beim Tech Lead.' }, { status: busy ? 503 : 502 });
  }
}
