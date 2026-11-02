// Konfidenz-Ampel und Kalibrierung durch Testbewertungen
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../lib/db', () => ({ db: () => ({ query: vi.fn() }) }));
const { traffic, calibrate } = await import('../../lib/answer');

describe('traffic() – Ampel', () => {
  it('Grün ab 85 bei guten Suchtreffern', () => {
    expect(traffic(90, 0.8, false)).toMatchObject({ value: 90, light: 'green' });
    expect(traffic(85, 0.72, false).light).toBe('green');
  });
  it('Gelb zwischen 60 und 84', () => {
    expect(traffic(84, 0.8, false).light).toBe('yellow');
    expect(traffic(60, 0.8, false).light).toBe('yellow');
  });
  it('Rot unter 60', () => {
    expect(traffic(59, 0.8, false).light).toBe('red');
  });
  it('mittlere Suchtreffer begrenzen auf höchstens Gelb (84)', () => {
    expect(traffic(95, 0.65, false)).toMatchObject({ value: 84, light: 'yellow', cap: 84 });
  });
  it('schwache Suchtreffer begrenzen auf Rot (59), auch wenn das Modell sehr sicher ist', () => {
    expect(traffic(100, 0.5, false)).toMatchObject({ value: 59, light: 'red' });
  });
  it('ein Widerspruch zwischen Quellen ergibt höchstens Gelb', () => {
    expect(traffic(95, 0.9, true)).toMatchObject({ value: 84, light: 'yellow' });
  });
  it('fehlende oder ungültige Selbsteinschätzung zählt als 0 (Rot)', () => {
    expect(traffic(undefined, 0.9, false)).toMatchObject({ value: 0, light: 'red' });
    expect(traffic(-20, 0.9, false).value).toBe(0);
  });
});

describe('calibrate() – Lernen aus Testbewertungen', () => {
  const amp = (value, cap = 100) => ({ value, cap, light: value >= 85 ? 'green' : value >= 60 ? 'yellow' : 'red' });
  const hits = [{ doc_id: 'PAY-02' }, { doc_id: 'KOR-001' }];

  it('ohne ähnliche Bewertung bleibt alles unverändert', () => {
    const a = amp(90);
    expect(calibrate(a, null, hits)).toBe('');
    expect(a).toMatchObject({ value: 90, light: 'green' });
  });
  it('«falsch» drückt auf höchstens 55 (Rot)', () => {
    const a = amp(92);
    expect(calibrate(a, { verdict: 'falsch' }, hits)).toMatch(/als falsch/);
    expect(a).toMatchObject({ value: 55, light: 'red' });
  });
  it('«teilweise» drückt auf höchstens 75 (Gelb)', () => {
    const a = amp(92);
    calibrate(a, { verdict: 'teilweise' }, hits);
    expect(a).toMatchObject({ value: 75, light: 'yellow' });
  });
  it('«richtig» gibt +5, aber nie über die Suchgrenze', () => {
    const a = amp(82);
    calibrate(a, { verdict: 'richtig' }, hits);
    expect(a).toMatchObject({ value: 87, light: 'green' });
    const b = amp(82, 84);
    calibrate(b, { verdict: 'richtig' }, hits);
    expect(b.value).toBe(84);
  });
  it('wurde die erfasste Korrektur gefunden, entfällt die Abwertung', () => {
    const a = amp(88);
    const text = calibrate(a, { verdict: 'falsch', correction_doc_id: 'KOR-001' }, hits);
    expect(a.value).toBe(93);
    expect(text).toMatch(/KOR-001 ist berücksichtigt/);
  });
  it('wurde die Korrektur nicht gefunden, gilt die Abwertung weiter', () => {
    const a = amp(88);
    calibrate(a, { verdict: 'falsch', correction_doc_id: 'KOR-009' }, hits);
    expect(a.value).toBe(55);
  });
});

const { wayForward, FALLBACK_SUGGESTIONS, FALLBACK_CONTACT, tooShort, wordCount } = await import('../../lib/answer');

describe('wayForward() – nie eine Sackgasse', () => {
  it('Grün: keine Vorschläge und keine Ansprechstelle nötig', () => {
    expect(wayForward({ light: 'green', suggestions: ['x'], contact: 'y' })).toMatchObject({ suggestions: [], contact: '' });
  });
  it('Rot ohne Weiterweg erhält feste Vorschläge und eine Ansprechstelle (Befund Regressionstest R11)', () => {
    const o = wayForward({ light: 'red', suggestions: [], contact: '' });
    expect(o.suggestions).toEqual(FALLBACK_SUGGESTIONS);
    expect(o.contact).toBe(FALLBACK_CONTACT);
  });
  it('vorhandene Vorschläge und Ansprechstellen des Modells bleiben erhalten', () => {
    const o = wayForward({ light: 'yellow', suggestions: ['Frage A'], contact: 'Fraud Desk, intern 4499' });
    expect(o).toMatchObject({ suggestions: ['Frage A'], contact: 'Fraud Desk, intern 4499' });
  });
});

describe('tooShort() – Längenvorgabe je Stufe (Befund Regressionstest R01)', () => {
  const satz = 'Eine Instant Payment wird in wenigen Sekunden gutgeschrieben.';
  it('zählt Wörter ohne Aufzählungszeichen', () => expect(wordCount('- **Punkt** eins\n- zwei')).toBe(3));
  it('Basic mit einem Satz ist zu kurz', () => expect(tooShort('basic', satz, 100)).toBe(true));
  it('Instant darf kurz sein', () => expect(tooShort('instant', satz, 100)).toBe(false));
  it('bei Rot wird nicht nachgebessert (kurze «weiss ich nicht»-Antwort ist richtig)', () => expect(tooShort('basic', satz, 30)).toBe(false));
  it('Basic mit 100 Wörtern ist in Ordnung', () => expect(tooShort('basic', 'wort '.repeat(100), 90)).toBe(false));
});

describe('Allgemeinwissen (Feature-Toggle)', () => {
  it('Antwort aus Allgemeinwissen ist höchstens Gelb (75), auch bei sehr sicherem Modell', () => {
    expect(traffic(95, 0.9, false, true)).toMatchObject({ value: 75, light: 'yellow' });
  });
  it('und wird nicht wegen schwacher Suchtreffer automatisch Rot', () => {
    expect(traffic(80, 0.4, false, true)).toMatchObject({ value: 75, light: 'yellow' });
  });
});
