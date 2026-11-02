// Live-Tests gegen die laufende App (Produktion oder Preview).
// Aufruf:  BASE_URL=https://zhaw-lnw-mod2.vercel.app ADMIN_TOKEN=... npm run test:live
// Optional: ONLY=R01,R02  (nur bestimmte Fragen)  ·  OUT=bericht.json (Ergebnis speichern)
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = (process.env.BASE_URL || 'https://zhaw-lnw-mod2.vercel.app').replace(/\/$/, '');
const TOKEN = process.env.ADMIN_TOKEN;
if (!TOKEN) { console.error('ADMIN_TOKEN fehlt (Umgebungsvariable).'); process.exit(2); }
const { fragen } = JSON.parse(readFileSync(new URL('../../../tests/regression.json', import.meta.url)));
const only = process.env.ONLY?.split(',');

const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? '✔' : '✘'} ${name}${detail ? ` – ${detail}` : ''}`); };

// 1) Smoke: Erreichbarkeit und Zugangsschutz
async function smoke() {
  const login = await fetch(`${BASE}/login`);
  check('Smoke: Login-Seite erreichbar', login.status === 200, `HTTP ${login.status}`);
  const home = await fetch(`${BASE}/`, { redirect: 'manual' });
  check('Smoke: Startseite ohne Anmeldung leitet auf /login', [307, 308].includes(home.status) && /\/login/.test(home.headers.get('location') || ''), `HTTP ${home.status}`);
  const ask = await fetch(`${BASE}/api/ask`, { method: 'POST', body: '{}' });
  check('Smoke: API ohne Anmeldung gesperrt (401)', ask.status === 401, `HTTP ${ask.status}`);
  const adm = await fetch(`${BASE}/api/admin/search?q=test`);
  check('Smoke: Admin-API ohne Token gesperrt (401)', adm.status === 401, `HTTP ${adm.status}`);
  const bad = await fetch(`${BASE}/api/login`, { method: 'POST', redirect: 'manual', body: new URLSearchParams({ username: 'admin', password: 'sicher-falsch' }) });
  check('Smoke: falsches Admin-Passwort wird abgewiesen', bad.status === 303 && /fehler=falsch/.test(bad.headers.get('location') || ''), `HTTP ${bad.status}`);
  const stats = await fetch(`${BASE}/api/admin/ingest?step=stats&token=${TOKEN}`);
  const s = stats.ok ? await stats.json() : {};
  check('Smoke: Datenbank erreichbar, Wissensbasis gefüllt', stats.ok && JSON.stringify(s).length > 2, stats.ok ? JSON.stringify(s).slice(0, 120) : `HTTP ${stats.status}`);
}

// 2) Regression: Referenzfragen
async function regression() {
  for (const f of fragen.filter((x) => !only || only.includes(x.id))) {
    let r;
    try {
      const res = await fetch(`${BASE}/api/admin/ask?token=${TOKEN}&level=${f.level || 'basic'}&q=${encodeURIComponent(f.frage)}`);
      r = await res.json();
      if (!res.ok) throw new Error(r.error || `HTTP ${res.status}`);
    } catch (e) { check(`${f.id} ${f.frage}`, false, `Fehler: ${e.message}`); continue; }
    const docs = (r.sources || []).map((s) => s.doc_id);
    const problems = [];
    if (f.expect_docs?.length && !f.expect_docs.some((d) => docs.includes(d))) problems.push(`Quelle fehlt (erwartet ${f.expect_docs.join('/')}, erhalten ${docs.join(', ') || 'keine'})`);
    if (f.lights && !f.lights.includes(r.light)) problems.push(`Ampel ${r.light} (${r.confidence}), erlaubt ${f.lights.join('/')}`);
    for (const w of f.must_contain || []) if (!r.answer?.toLowerCase().includes(w.toLowerCase())) problems.push(`Begriff «${w}» fehlt`);
    if (r.light !== 'green' && !(r.suggestions?.length || r.contact)) problems.push('Sackgasse: weder Vorschläge noch Ansprechstelle');
    if (!r.answer?.trim()) problems.push('leere Antwort');
    const words = r.answer?.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length || 0;
    const lim = { instant: [0, 70], basic: [80, 320], full: [300, 1100] }[f.level || 'basic'];
    if (r.light !== 'red' && (words < lim[0] || words > lim[1])) problems.push(`Länge ${words} Wörter, Vorgabe ${lim[0]}–${lim[1]}`);
    for (const s of r.sources || []) if (!s.title) problems.push(`Quelle ${s.doc_id} ohne Titel`);
    if (f.bekannt && problems.length) { results.push({ name: `${f.id} ${f.frage}`, ok: true, known: true, detail: problems.join('; ') }); console.log(`⚠ ${f.id} ${f.frage} – bekannter Befund: ${f.bekannt} (${problems.join('; ')})`); continue; }
    check(`${f.id} ${f.frage}`, problems.length === 0, problems.join('; ') || `${r.light} ${r.confidence} · ${docs.slice(0, 3).join(', ')} · ${r.debug?.totalMs ?? '?'} ms`);
    results.at(-1).raw = { light: r.light, confidence: r.confidence, docs, ms: r.debug?.totalMs, model: r.model };
  }
}

await smoke();
await regression();
const failed = results.filter((x) => !x.ok);
console.log(`\n${results.length - failed.length}/${results.length} bestanden`);
if (process.env.OUT) writeFileSync(process.env.OUT, JSON.stringify({ base: BASE, at: new Date().toISOString(), results }, null, 2));
process.exit(failed.length ? 1 : 0);
