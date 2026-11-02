// Gemeinsame Verarbeitung für Upload und Ersetzen: Datei prüfen, umwandeln, aufteilen, einbetten.
import { createHash } from 'node:crypto';
import { embed } from './gemini';
import { config } from './config';
import { toMarkdown } from './convert';
import { chunkMarkdown } from './chunk';
import { checkDocument, count } from './guard';

export const MAX_BYTES = 4 * 1024 * 1024;
export const ALLOWED = ['docx', 'pdf', 'md', 'txt'];

import { UserError, errorResponse } from './errors';
export { UserError, errorResponse };

export function checkFile(file) {
  if (!file || typeof file === 'string' || !file.size) throw new UserError('Wähle eine Datei aus.');
  const ext = file.name.toLowerCase().split('.').pop();
  if (!ALLOWED.includes(ext)) throw new UserError(`Dateityp «.${ext}» wird nicht unterstützt. Erlaubt sind Word (.docx), PDF, Markdown (.md) und Text (.txt). Ältere Word-Dateien (.doc) bitte zuerst als .docx speichern.`, 415);
  if (file.size > MAX_BYTES) throw new UserError(`Die Datei ist ${(file.size / 1024 / 1024).toFixed(1)} MB gross; erlaubt sind höchstens 4 MB.`, 413);
}

export async function processFile(file, fullTitle) {
  let markdown;
  try {
    markdown = (await toMarkdown(file.name, Buffer.from(await file.arrayBuffer()))).trim();
  } catch (e) {
    if (e instanceof UserError) throw e;
    throw new UserError('Die Datei konnte nicht gelesen werden. Ist sie beschädigt oder passwortgeschützt? Speichere sie neu und versuche es nochmals.', 422);
  }
  if (markdown.length < 50) throw new UserError('Im Dokument wurde kaum Text gefunden. Eingescannte PDFs ohne Texterkennung können nicht gelesen werden.', 422);
  return processMarkdown(markdown, fullTitle);
}

export async function processMarkdown(markdown, fullTitle) {
  const suspicious = checkDocument(markdown);
  if (suspicious) {
    await count('upload_blocked');
    throw new UserError(`Das Dokument enthält eine Formulierung, die wie eine Anweisung an die KI aussieht («${suspicious}»). Aus Sicherheitsgründen wird es nicht übernommen. Entferne die Stelle oder melde dich beim Admin.`, 422);
  }
  const chunks = chunkMarkdown(markdown).map((c) => ({ ...c, embed_text: `${fullTitle}\nAbschnitt: ${c.section}\n\n${c.content}` }));
  if (chunks.length > 300) throw new UserError(`Das Dokument ist zu umfangreich (${chunks.length} Abschnitte, höchstens 300). Teile es in mehrere Dokumente auf.`, 413);

  const vectors = [];
  try {
    for (let i = 0; i < chunks.length; i += 100) {
      const batch = chunks.slice(i, i + 100);
      vectors.push(...await embed(batch.map((c) => c.embed_text), 'RETRIEVAL_DOCUMENT', batch.map(() => fullTitle)));
    }
  } catch (e) {
    if (/\(429\)/.test(e.message)) throw new UserError('Der KI-Dienst ist gerade ausgelastet. Versuche es in einer Minute nochmals.', 503);
    throw new UserError('Der KI-Dienst ist nicht erreichbar. Versuche es in einigen Minuten nochmals. Es wurde nichts verändert.', 502);
  }
  return {
    markdown,
    chunks: chunks.map((c, i) => ({
      ...c,
      hash: createHash('sha256').update(`${config.embedModel}|${c.embed_text}`).digest('hex').slice(0, 16),
      vector: vectors[i],
    })),
  };
}

