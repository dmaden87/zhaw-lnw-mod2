// Dateiprüfung beim Upload (Server und Browser) und Umwandlung in Markdown
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../lib/gemini', () => ({ embed: vi.fn(async (texts) => texts.map(() => Array(768).fill(0.01))) }));
const { checkFile, processMarkdown, UserError } = await import('../../lib/ingestFile');
const { fileProblem } = await import('../../lib/clientFetch');
const { toMarkdown } = await import('../../lib/convert');
const { slug, docHref } = await import('../../lib/slug');

const file = (name, size = 1000) => ({ name, size });

describe('checkFile() / fileProblem()', () => {
  it('erlaubt docx, pdf, md und txt', () => {
    for (const n of ['a.docx', 'b.PDF', 'c.md', 'd.txt']) {
      expect(() => checkFile(file(n))).not.toThrow();
      expect(fileProblem(file(n))).toBe('');
    }
  });
  it('lehnt andere Dateitypen mit Hinweis ab (415)', () => {
    try { checkFile(file('alt.doc')); throw new Error('kein Fehler'); } catch (e) {
      expect(e).toBeInstanceOf(UserError); expect(e.status).toBe(415); expect(e.message).toMatch(/\.docx speichern/);
    }
    expect(fileProblem(file('bild.png'))).toMatch(/«\.png» wird nicht unterstützt/);
  });
  it('lehnt Dateien über 4 MB ab (413)', () => {
    expect(() => checkFile(file('gross.pdf', 5 * 1024 * 1024))).toThrow(/5\.0 MB/);
    expect(fileProblem(file('gross.pdf', 5 * 1024 * 1024))).toMatch(/höchstens 4 MB/);
  });
  it('verlangt eine Datei', () => {
    expect(() => checkFile(null)).toThrow(/Wähle eine Datei/);
    expect(fileProblem(file('leer.md', 0))).toMatch(/Wähle eine Datei/);
  });
});

describe('toMarkdown()', () => {
  it('liest Markdown und Text unverändert', async () => {
    expect(await toMarkdown('a.md', Buffer.from('# Titel\nText'))).toBe('# Titel\nText');
    expect(await toMarkdown('a.txt', Buffer.from('Nur Text'))).toBe('Nur Text');
  });
  it('wirft bei unbekanntem Typ', async () => {
    await expect(toMarkdown('a.xls', Buffer.from(''))).rejects.toThrow(/nicht unterstützt/);
  });
});

describe('processMarkdown()', () => {
  it('liefert Abschnitte mit Vektoren', async () => {
    const r = await processMarkdown('# A\nInhalt A\n\n# B\nInhalt B', 'TEST-01 Testdokument');
    expect(r.chunks).toHaveLength(2);
    expect(r.chunks[0].vector).toHaveLength(768);
    expect(r.chunks[0].embed_text).toMatch(/^TEST-01 Testdokument\nAbschnitt: A/);
  });
  it('meldet einen ausgelasteten KI-Dienst verständlich (503)', async () => {
    const { embed } = await import('../../lib/gemini');
    embed.mockRejectedValueOnce(new Error('Embedding fehlgeschlagen (429)'));
    await expect(processMarkdown('# A\nInhalt', 'X')).rejects.toMatchObject({ status: 503 });
  });
});

describe('Quellen-Links', () => {
  it('slug() macht Umlaute und Sonderzeichen URL-tauglich', () => {
    expect(slug('4. Prozessablauf (Übersicht)')).toBe('4-prozessablauf-uebersicht');
  });
  it('docHref() verlinkt auf Dokument und Kapitel', () => {
    expect(docHref('IF-01', '3. Fehlerfälle')).toBe('/dokument/IF-01#3-fehlerfaelle');
    expect(docHref('IF-01', 'Übersicht')).toBe('/dokument/IF-01');
  });
});
