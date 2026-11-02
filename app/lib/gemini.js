import { config } from './config';

const BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';
const headers = () => ({ 'x-goog-api-key': process.env.GEMINI_API_KEY, 'content-type': 'application/json' });

// Embeddings für mehrere Texte in einem Aufruf. taskType: RETRIEVAL_DOCUMENT (Wissen) oder RETRIEVAL_QUERY (Frage).
export async function embed(texts, taskType, titles = []) {
  const model = `models/${config.embedModel}`;
  const requests = texts.map((text, i) => ({
    model,
    content: { parts: [{ text }] },
    taskType,
    ...(titles[i] && taskType === 'RETRIEVAL_DOCUMENT' ? { title: titles[i] } : {}),
    outputDimensionality: config.dims,
  }));
  const res = await fetch(`${BASE}${config.embedModel}:batchEmbedContents`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ requests }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Embedding fehlgeschlagen (${res.status}): ${data?.error?.message}`);
  return data.embeddings.map((e) => e.values);
}
