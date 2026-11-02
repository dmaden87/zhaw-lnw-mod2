import { config } from './config';
import { retrieve, contacts } from './retrieve';

const BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';

export const LEVELS = {
  instant: { label: 'Instant', k: 6, model: () => config.fastModel,
    rule: 'INSTANT: maximal 2–3 kurze Sätze (höchstens 50 Wörter), in 5–10 Sekunden lesbar. Nur das Wesentliche, damit man sofort mitreden kann. Keine Überschriften.' },
  basic: { label: 'Basic', k: 8, model: () => config.fastModel,
    rule: 'BASIC: 150–250 Wörter, in höchstens 3 Minuten lesbar. Ein Einleitungssatz, dann 4–7 Stichpunkte mit Kernpunkten, Ablauf und wichtigen Begriffen.' },
  full: { label: 'Full', k: 12, model: () => config.fullModel, thinking: 'minimal',
    rule: 'FULL: 500–900 Wörter, in höchstens 15 Minuten lesbar. Gliederung mit kurzen Zwischentiteln (##): Kurzfassung; Ablauf bzw. Funktionsweise; beteiligte Systeme und Schnittstellen; Regeln, Fristen und Limiten; offene Punkte oder Widersprüche; Ansprechstellen.' },
};

const SYSTEM = `Du bist der Briefing-Bot der Gletscherbank AG (fiktive Musterbank). Du lieferst Mitarbeitenden in Meetings kompaktes, verlässliches Wissen zu Prozessen, Schnittstellen und Fachthemen des Zahlungsverkehrs.

Regeln:
1. Antworte ausschliesslich auf Basis der KONTEXT-Abschnitte. Erfinde keine Zahlen, Fristen, Namen, Systeme oder Entscheide. Fehlt etwas im Kontext, sag das.
2. Gib in "sources" alle Abschnitte an, auf die sich deine Antwort stützt (doc_id und section exakt wie im Kontext).
3. Widersprüche zwischen Quellen: Ein Meeting-Protokoll (MP) gilt vor einem Transkript (TR); eine neuere Version gilt vor einer älteren. Beschreibe jeden Widerspruch in "contradictions".
4. "confidence" (0–100): 85–100 nur, wenn mehrere übereinstimmende Abschnitte die Frage direkt beantworten. 60–84, wenn nur eine Quelle oder nur ein Teil der Frage abgedeckt ist oder ein Widerspruch besteht. Unter 60, wenn der Kontext die Frage nicht direkt beantwortet. Begründe kurz in "confidence_reason".
5. Bei confidence unter 85: schlage in "suggestions" 2–3 verwandte Fragen vor, die der Kontext gut beantworten kann. Nenne in "contact" die zuständige Stelle (aus dem Organigramm oder dem Dokument-Owner), wenn möglich mit interner Nummer.
6. Halte dich strikt an die Längenvorgabe der Stufe.
7. Schreibe Deutsch in Schweizer Rechtschreibung (ss statt ß). Verwende Markdown (fett, Stichpunkte; Zwischentitel nur bei FULL).`;

const SCHEMA = {
  type: 'OBJECT',
  properties: {
    answer: { type: 'STRING' },
    confidence: { type: 'INTEGER' },
    confidence_reason: { type: 'STRING' },
    sources: { type: 'ARRAY', items: { type: 'OBJECT', properties: { doc_id: { type: 'STRING' }, section: { type: 'STRING' } }, required: ['doc_id', 'section'] } },
    contradictions: { type: 'STRING' },
    suggestions: { type: 'ARRAY', items: { type: 'STRING' } },
    contact: { type: 'STRING' },
  },
  required: ['answer', 'confidence', 'confidence_reason', 'sources'],
};

async function generate(model, prompt, thinking) {
  const generationConfig = { responseMimeType: 'application/json', responseSchema: SCHEMA, temperature: 0.2 };
  if (thinking) generationConfig.thinkingConfig = { thinkingLevel: thinking };
  const res = await fetch(`${BASE}${model}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    }),
  });
  const data = await res.json();
  if (!res.ok) { const e = new Error(data?.error?.message || `HTTP ${res.status}`); e.status = res.status; throw e; }
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '{}';
  return JSON.parse(text);
}

// Ampel: Selbsteinschätzung des Modells, begrenzt durch die Qualität der Suchtreffer.
function traffic(llmConfidence, topScore, hasContradiction) {
  let cap = topScore >= 0.72 ? 100 : topScore >= 0.62 ? 84 : 59;
  if (hasContradiction) cap = Math.min(cap, 84);
  const value = Math.max(0, Math.min(llmConfidence ?? 0, cap));
  return { value, light: value >= 85 ? 'green' : value >= 60 ? 'yellow' : 'red', cap };
}

export async function answer(question, levelKey = 'basic') {
  const level = LEVELS[levelKey] || LEVELS.basic;
  const t0 = Date.now();
  const [hits, org] = await Promise.all([retrieve(question, level.k), contacts()]);
  const t1 = Date.now();
  const context = [...hits, ...org.filter((o) => !hits.some((h) => h.id === o.id))]
    .map((c, i) => `[${i + 1}] ${c.doc_id} | ${c.title} | Abschnitt: ${c.section} | Owner: ${c.owner || '–'} | Stand: ${c.version || '–'}\n${c.content}`)
    .join('\n\n---\n\n');
  const prompt = `STUFE: ${level.rule}\n\nFRAGE: ${question}\n\nKONTEXT:\n${context}`;

  let model = level.model();
  let result;
  try {
    result = await generate(model, prompt, level.thinking);
  } catch (e) {
    if (![429, 500, 503].includes(e.status)) throw e;
    model = config.fallbackModel;
    result = await generate(model, prompt);
  }
  const topScore = hits.length ? Math.max(...hits.map((h) => h.score)) : 0;
  const amp = traffic(result.confidence, topScore, Boolean(result.contradictions && result.contradictions.trim()));

  const docs = new Map([...hits, ...org].map((h) => [h.doc_id, h]));
  const sources = (result.sources || [])
    .filter((s, i, a) => a.findIndex((x) => x.doc_id === s.doc_id && x.section === s.section) === i)
    .map((s) => ({ ...s, title: docs.get(s.doc_id)?.title, owner: docs.get(s.doc_id)?.owner, version: docs.get(s.doc_id)?.version }))
    .filter((s) => s.title);

  return {
    question, level: levelKey, model,
    answer: result.answer,
    confidence: amp.value, light: amp.light,
    confidence_reason: result.confidence_reason,
    contradictions: result.contradictions || '',
    suggestions: amp.light === 'green' ? [] : (result.suggestions || []).slice(0, 3),
    contact: amp.light === 'green' ? '' : (result.contact || ''),
    sources,
    debug: { llmConfidence: result.confidence, topScore, cap: amp.cap, retrievalMs: t1 - t0, totalMs: Date.now() - t0,
      hits: hits.map((h) => ({ doc_id: h.doc_id, section: h.section, score: h.score, rrf: Number(h.rrf.toFixed(4)) })) },
  };
}
