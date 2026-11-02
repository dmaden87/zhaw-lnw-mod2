// Listet die Gemini-Modelle, die mit dem hinterlegten GEMINI_API_KEY verfügbar sind.
// Dient der Modellauswahl (Schritt 2) – Quelle ist Google selbst, nicht Drittseiten.
export const dynamic = 'force-dynamic';

export async function GET() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return Response.json({ error: 'GEMINI_API_KEY fehlt' }, { status: 500 });

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000', {
    headers: { 'x-goog-api-key': key },
    cache: 'no-store',
  });
  const data = await res.json();
  if (!res.ok) return Response.json({ error: data }, { status: res.status });

  const pick = (m) => ({
    name: m.name?.replace('models/', ''),
    displayName: m.displayName,
    inputTokenLimit: m.inputTokenLimit,
    outputTokenLimit: m.outputTokenLimit,
  });
  const models = data.models || [];
  return Response.json({
    embedding: models.filter((m) => m.supportedGenerationMethods?.includes('embedContent')).map(pick),
    generation: models
      .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
      .filter((m) => /flash/i.test(m.name))
      .map(pick),
  });
}
