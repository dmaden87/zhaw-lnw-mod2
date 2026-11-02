// Aufteilen von Dokumenten in Abschnitte (muss zu db/build_chunks.py passen)
import { describe, it, expect } from 'vitest';
import { chunkMarkdown } from '../../lib/chunk';

describe('chunkMarkdown()', () => {
  it('trennt entlang der Überschriften und nennt Text vor der ersten Überschrift «Übersicht»', () => {
    const c = chunkMarkdown('Einleitung\n\n# 1. Zweck\nText A\n\n## 2. Ablauf\nText B');
    expect(c.map((x) => x.section)).toEqual(['Übersicht', '1. Zweck', '2. Ablauf']);
    expect(c[1].content).toBe('Text A');
  });
  it('entfernt Fettdruck und Escapes aus Überschriften', () => {
    const c = chunkMarkdown('## **4\\. Prozessablauf**\nInhalt');
    expect(c[0].section).toBe('4. Prozessablauf');
  });
  it('kein Abschnitt ist länger als ca. 1500 Zeichen', () => {
    const text = `# Lang\n${Array.from({ length: 40 }, (_, i) => `Absatz ${i} ${'x'.repeat(120)}`).join('\n\n')}`;
    const c = chunkMarkdown(text);
    expect(c.length).toBeGreaterThan(2);
    for (const x of c) expect(x.content.length).toBeLessThanOrEqual(1500);
    expect(c.map((x) => x.part)).toEqual(c.map((_, i) => i + 1));
  });
  it('lange Tabellen werden geteilt und jeder Teil behält die Kopfzeile', () => {
    const rows = Array.from({ length: 60 }, (_, i) => `| Feld ${i} | ${'Beschreibung '.repeat(4)} |`).join('\n');
    const c = chunkMarkdown(`# Felder\n| Name | Inhalt |\n| --- | --- |\n${rows}`);
    expect(c.length).toBeGreaterThan(1);
    for (const x of c) expect(x.content.startsWith('| Name | Inhalt |\n| --- | --- |')).toBe(true);
  });
  it('leere Abschnitte erzeugen keine Chunks', () => {
    expect(chunkMarkdown('# A\n\n# B\nText')).toHaveLength(1);
  });
});
