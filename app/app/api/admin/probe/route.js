// Testet, welche Modelle mit dem GEMINI_API_KEY (Gratis-Stufe) tatsächlich antworten.
export const dynamic = 'force-dynamic';

const BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';

async function call(model, method, body, key) {
  const t0 = Date.now();
  const res = await fetch(`${BASE}${model}:${method}`, {
    method: 'POST',
    headers: { 'x-goog-api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { model, status: res.status, ms: Date.now() - t0, data };
}

export async function GET(request) {
  const key = process.env.GEMINI_API_KEY;
  const p = request.nextUrl.searchParams;
  const embed = (p.get('embed') || 'gemini-embedding-2,gemini-embedding-001').split(',');
  const gen = (p.get('gen') || 'gemini-3.8-flash,gemini-3.5-flash,gemini-flash-latest,gemini-2.5-flash').split(',');

  const embedResults = await Promise.all(embed.map(async (m) => {
    const r = await call(m, 'embedContent', {
      content: { parts: [{ text: 'Wie läuft eine Instant-Zahlung bei der Gletscherbank?' }] },
      outputDimensionality: 768,
    }, key);
    return { model: m, status: r.status, ms: r.ms, dims: r.data?.embedding?.values?.length, error: r.data?.error?.message };
  }));

  const thinking = p.get('thinking'); // z. B. 'minimal' oder 'low'
  const genResults = await Promise.all(gen.map(async (m) => {
    const body = {
      contents: [{ role: 'user', parts: [{ text: 'Antworte in einem kurzen Satz auf Deutsch: Was ist ein Instant Payment?' }] }],
    };
    if (thinking) body.generationConfig = { thinkingConfig: { thinkingLevel: thinking } };
    const r = await call(m, 'generateContent', body, key);
    return {
      model: m, status: r.status, ms: r.ms,
      text: r.data?.candidates?.[0]?.content?.parts?.map((x) => x.text).join('').slice(0, 200),
      error: r.data?.error?.message?.slice(0, 200),
    };
  }));

  return Response.json({ embedding: embedResults, generation: genResults });
}
