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
    console.error(e);
    return Response.json({ error: 'Die Antwort konnte nicht erzeugt werden. Bitte nochmals versuchen.' }, { status: 502 });
  }
}
