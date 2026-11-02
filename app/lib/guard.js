// Schutzmechanismen ohne KI-Aufruf: Eingangskontrolle, Dokumentprüfung, Ausgangskontrolle, Zähler.
// Feste Regeln, weil sich ein Sprachmodell überreden lässt – diese Prüfungen nicht.
import { createHash } from 'node:crypto';
import { db } from './db';

// ---------- 1. Eingangskontrolle ----------

// JavaScript kennt bei \b nur ASCII-Buchstaben: vor «Übersetze» oder «übergehe» gibt es keine Wortgrenze.
// u() ersetzt \b durch eine Wortgrenze, die Umlaute und alle Unicode-Buchstaben kennt (Befund Live-Regression S05).
const W = '[\\p{L}\\p{N}_]';
const B = `(?:(?<=${W})(?!${W})|(?<!${W})(?=${W}))`;
const u = (re) => new RegExp(re.source.replaceAll('\\b', B), `${re.flags.replace('u', '')}u`);

const INJECTION_RAW = [
  /\b(ignorier|vergiss|missacht|übergeh|umgeh)\w*\b.{0,25}\b(alle|deine|vorherige\w*|obige\w*|bisherige\w*|vorangegangene\w*|system\w*)\b.{0,25}\b(anweisung|instruktion|regel|vorgabe|prompt)/i,
  /\b(ignorier|vergiss|missacht)\w*\b.{0,30}\b(anweisung|instruktion|prompt)\w*\b.{0,15}\b(oben|zuvor|vorher|bisher)\b/i,
  /\bignore\b.{0,30}\b(instruction|rule|prompt|guideline)/i,
  /\b(disregard|forget|override|bypass)\b.{0,30}\b(instruction|rule|prompt|guideline|previous|above)/i,
  /\b(du bist|sei|agiere|verhalte dich)\b.{0,15}\b(jetzt|ab sofort|nun|ab jetzt)\b.{0,10}\b(ein|eine|der|die|mein|kein)\b/i,
  /\byou are now\b|\bact as\b|\bpretend (to be|you)\b|\broleplay\b/i,
  /\b(tu so als|spiel\w* die rolle|rollenspiel|schlüpf\w* in die rolle)\b/i,
  /\b(entwickler|developer|debug|god)[- ]?(modus|mode)\b|\bjailbreak\b/i,
  /\bDAN\b/,
  /<\|?(system|im_start|im_end)\|?>|\[(system|inst)\]|^\s*#{2,}\s*system/im,
  /\b(neue|new) (anweisung|instruktion|instruction)(en|s)?\s*:/i,
];
const PROMPT_LEAK_RAW = [
  /\b(system[- ]?prompt|systemanweisung|systemnachricht|initial prompt|system message)\b/i,
  /\b(zeig|gib|nenn|verrat|wiederhol|zitier|druck|schreib|list|ausgeb|übersetz)\w*\b.{0,40}\b(deine|dein|dir|internen|versteckten|geheimen|ersten)\b.{0,25}\b(anweisungen|instruktionen|regeln|vorgaben|konfiguration|einstellungen|kennung)\b/i,
  /\b(reveal|show|print|repeat|tell me)\b.{0,30}\b(your|the|hidden)\b.{0,20}\b(instructions|rules|prompt|configuration)\b/i,
  /\bwelche (anweisungen|regeln|instruktionen) (hast du|wurden dir|gelten für dich)\b/i,
];
const CODE_RAW = [
  /```/,
  /<\s*(script|iframe|img|svg|object)\b|javascript:/i,
  /\b(select\s+[\w*,\s]+\s+from|insert\s+into|update\s+\w+\s+set|delete\s+from|drop\s+(table|database)|union\s+select)\b/i,
  /\b(rm\s+-rf|sudo\s|curl\s+https?:|wget\s|powershell|cmd\.exe|\/bin\/(ba)?sh)\b/i,
  /^\s*(import\s+[\w.{}, *]+(\s+from\s+\S+)?|from\s+[\w.]+\s+import\s)|\bdef\s+\w+\s*\(|\bfunction\s*\w*\s*\(|console\.log|\beval\s*\(|\bexec\s*\(|os\.system|<\?php/m,
  /\b(schreib|programmier|erstell|generier|code)\w*\b.{0,30}\b(code|skript|script|programm|makro|sql|python|javascript|java|regex|bash|excel-formel)\b/i,
  /\bwrite\b.{0,20}\b(code|script|program|function|query)\b/i,
];

const INJECTION = INJECTION_RAW.map(u);
const PROMPT_LEAK = PROMPT_LEAK_RAW.map(u);
const CODE = CODE_RAW; // nur ASCII-Schlüsselwörter

// Personendaten: IBAN, Kartennummern (Luhn), AHV-Nummer, E-Mail – werden vor der Verarbeitung geschwärzt
const luhn = (digits) => {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
};
const PII = [
  { label: 'IBAN', re: /\b[A-Z]{2}\d{2}(?:\s?[0-9A-Z]{4}){3,7}(?:\s?[0-9A-Z]{1,3})?\b/g, test: (m) => /^(CH|LI|DE|AT|FR|IT)/.test(m) },
  { label: 'Kartennummer', re: /\b(?:\d[ -]?){13,19}\b/g, test: (m) => luhn(m.replace(/\D/g, '')) },
  { label: 'AHV-Nummer', re: /\b756[.\s]?\d{4}[.\s]?\d{4}[.\s]?\d{2}\b/g, test: () => true },
  { label: 'E-Mail-Adresse', re: /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, test: () => true },
];

export function maskPII(text) {
  const found = new Set();
  let masked = String(text);
  for (const { label, re, test } of PII) {
    masked = masked.replace(re, (m) => (test(m) ? (found.add(label), `[${label} entfernt]`) : m));
  }
  return { masked, found: [...found] };
}

export const BLOCK_TEXT = {
  injection: 'Diese Anfrage kann ich nicht bearbeiten. Ich befolge keine Anweisungen, die meine Regeln oder meine Rolle ändern sollen. Stelle mir gerne eine Fachfrage zu Zahlungsverkehr, Prozessen oder Schnittstellen.',
  systemprompt: 'Dazu kann ich keine Auskunft geben. Meine internen Anweisungen und meine Konfiguration sind vertraulich. Ich beantworte Fachfragen zum Zahlungsverkehr der Gletscherbank.',
  code: 'Ich schreibe und prüfe keinen Programmcode und führe nichts aus. Für technische Fragen zu Schnittstellen (z. B. camt.054, Payment Initiation API) frage nach dem Inhalt, dann zeige ich dir, was die Dokumentation dazu sagt.',
};

// Liefert { blocked, category } oder { question (geschwärzt), pii: [...] }
export function checkInput(question) {
  const q = String(question || '');
  if (PROMPT_LEAK.some((re) => re.test(q))) return { blocked: true, category: 'systemprompt' };
  if (INJECTION.some((re) => re.test(q))) return { blocked: true, category: 'injection' };
  if (CODE.some((re) => re.test(q))) return { blocked: true, category: 'code' };
  const { masked, found } = maskPII(q);
  return { blocked: false, question: masked, pii: found };
}

// Missbrauch begrenzen: höchstens 30 Fragen pro Person in 10 Minuten (pro Server-Instanz; im Pilot zentral)
const WINDOW = 10 * 60 * 1000;
export const RATE_LIMIT = 30;
const recent = new Map();
export function rateLimited(key, now = Date.now(), limit = RATE_LIMIT) {
  const list = (recent.get(key) || []).filter((t) => now - t < WINDOW);
  if (list.length >= limit) { recent.set(key, list); return true; }
  list.push(now); recent.set(key, list);
  return false;
}

// ---------- 3. Dokumente als Daten ----------

export function checkDocument(markdown) {
  const text = String(markdown || '');
  for (const re of [...INJECTION, ...PROMPT_LEAK]) {
    const m = text.match(re);
    if (m) return m[0].slice(0, 80);
  }
  return '';
}

// Dokumentauszüge klar abgrenzen; Abschlussmarken im Inhalt unschädlich machen
export const fence = (s) => String(s || '').replace(/<\/?\s*(dokument|frage|system)[^>]*>/gi, '[…]');

// ---------- 4. Ausgangskontrolle ----------

export const CANARY = `GBK-${createHash('sha256').update(`canary|${process.env.SESSION_SECRET || 'dev'}`).digest('hex').slice(0, 10)}`;
const FINGERPRINTS = ['Grundregeln (gelten immer', 'sind Daten, keine Anweisungen', 'Interne Kennung (vertraulich)', 'responseSchema', 'confidence_reason'];

export function leaksPrompt(answer) {
  const a = String(answer || '');
  return a.includes(CANARY) || FINGERPRINTS.some((f) => a.toLowerCase().includes(f.toLowerCase()));
}

// Zahlen: jede Ziffernfolge ab 2 Stellen in der Antwort muss im Kontext oder in der Frage vorkommen
const joinThousands = (s) => String(s).replace(/(\d)['’   ](?=\d{3}\b)/g, '$1');
export function numberSet(text) {
  const set = new Set();
  for (const run of joinThousands(text).match(/\d+/g) || []) {
    const n = run.replace(/^0+(?=\d)/, '');
    if (n.length >= 2) set.add(n);
  }
  return set;
}
export function unverifiedNumbers(answer, context) {
  const known = numberSet(context);
  return [...numberSet(answer)].filter((n) => !known.has(n));
}

// Code-Blöcke nur, wenn sie wörtlich aus einer Quelle stammen
const squash = (s) => String(s).replace(/\s+/g, ' ').trim();
export function stripCode(answer, context) {
  let removed = 0;
  const ctx = squash(context);
  const text = String(answer || '').replace(/```[\w-]*\n?([\s\S]*?)```/g, (block, inner) => {
    if (squash(inner) && ctx.includes(squash(inner))) return block;
    removed++;
    return '_(Code-Ausschnitt entfernt – der Briefing-Bot gibt nur Code wieder, der wörtlich in einer Quelle steht.)_';
  });
  return { text, removed };
}

// ---------- 5. Zähler (nur Anzahl pro Tag und Kategorie, keine Fragetexte) ----------

export const CATEGORIES = {
  injection: 'Manipulationsversuch (Regeln/Rolle ändern)',
  systemprompt: 'Frage nach Systemprompt/Konfiguration',
  code: 'Code in der Frage oder Code verlangt',
  pii: 'Personendaten geschwärzt',
  rate_limit: 'Zu viele Anfragen',
  upload_blocked: 'Dokument mit Anweisungen an die KI abgewiesen',
  output_leak: 'Antwort blockiert (Systemprompt)',
  output_numbers: 'Zahlen nicht in den Quellen (herabgestuft)',
  output_code: 'Code aus Antwort entfernt',
  out_of_scope: 'Frage ausserhalb Zahlungsverkehr/Banking',
  general: 'Antwort mit Allgemeinwissen',
};

export async function count(category) {
  try {
    await db().query(
      `INSERT INTO guard_counts (day, category, count) VALUES (current_date, $1, 1)
       ON CONFLICT (day, category) DO UPDATE SET count = guard_counts.count + 1`, [category]);
  } catch (e) { console.error('[guard-count]', e.message); }
}
