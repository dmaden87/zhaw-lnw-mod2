import { answer } from '../../../lib/answer';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request) {
  const { question, level } = await request.json().catch(() => ({}));
  if (!question || !question.trim()) return Response.json({ error: 'Bitte eine Frage eingeben.' }, { status: 400 });
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
