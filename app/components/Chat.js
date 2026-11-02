'use client';
import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const LEVELS = [
  { key: 'instant', label: 'Instant', hint: '5–10 Sek. lesen' },
  { key: 'basic', label: 'Basic', hint: '≤ 3 Min.' },
  { key: 'full', label: 'Full', hint: '≤ 15 Min.' },
];
const LIGHT = {
  green: { label: 'Sicher', bg: '#e7f6ec', fg: '#17663a', dot: '#22a05a' },
  yellow: { label: 'Ziemlich sicher', bg: '#fff4e0', fg: '#8a4b06', dot: '#e8a317' },
  red: { label: 'Unsicher', bg: '#fdecec', fg: '#9b1c1c', dot: '#dc3b3b' },
};
const EXAMPLES = [
  'Was passiert bei einem Timeout im Instant Payment?',
  'Welche Datenfelder schickt PayHub an ScreenGuard?',
  'Was wurde zur LSV-Migration entschieden?',
];

export default function Chat() {
  const [level, setLevel] = useState('instant');
  const [question, setQuestion] = useState('');
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  async function ask(q, lvl = level) {
    const text = (q ?? question).trim();
    if (!text) { setError('Bitte zuerst eine Frage eingeben.'); inputRef.current?.focus(); return; }
    setError(''); setBusy(true);
    const t0 = Date.now();
    try {
      const res = await fetch('/api/ask', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question: text, level: lvl }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fehler');
      setItems((prev) => [{ ...data, seconds: ((Date.now() - t0) / 1000).toFixed(1) }, ...prev]);
      setQuestion('');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }} role="radiogroup" aria-label="Detailstufe">
        {LEVELS.map((l) => (
          <button key={l.key} type="button" role="radio" aria-checked={level === l.key} onClick={() => setLevel(l.key)}
            style={{ flex: 1, padding: '8px 6px', borderRadius: 8, cursor: 'pointer', border: level === l.key ? '2px solid #2f5bea' : '1px solid #cfd5df',
              background: level === l.key ? '#e8eefe' : '#fff', color: '#1d2433', fontSize: 14 }}>
            <strong>{l.label}</strong><br /><span style={{ fontSize: 12, color: '#6b7385' }}>{l.hint}</span>
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); ask(); }}>
        <textarea ref={inputRef} value={question} rows={2} placeholder="Frage zu Prozess, Schnittstelle oder Fachthema …"
          onChange={(e) => { setQuestion(e.target.value); if (error) setError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } }}
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: 16, border: '1px solid #cfd5df', borderRadius: 8, resize: 'vertical', fontFamily: 'inherit' }} />
        {error && <p style={{ color: '#b42318', fontSize: 14, margin: '6px 0 0' }}>{error}</p>}
        <button type="submit" disabled={busy}
          style={{ marginTop: 8, width: '100%', padding: '10px', fontSize: 16, background: busy ? '#8da2e8' : '#2f5bea', color: '#fff', border: 0, borderRadius: 8, cursor: busy ? 'wait' : 'pointer' }}>
          {busy ? 'Suche in der Wissensbasis …' : 'Briefing holen'}
        </button>
      </form>

      {items.length === 0 && (
        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 13, color: '#6b7385', margin: '0 0 6px' }}>Beispiele:</p>
          {EXAMPLES.map((ex) => (
            <button key={ex} type="button" onClick={() => ask(ex)} disabled={busy}
              style={{ display: 'block', width: '100%', textAlign: 'left', margin: '0 0 6px', padding: '8px 10px', border: '1px solid #dfe3ea', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 14, color: '#1d2433' }}>
              {ex}
            </button>
          ))}
        </div>
      )}

      {items.map((it, i) => <Answer key={items.length - i} it={it} onAsk={(q) => ask(q, it.level)} busy={busy} />)}
    </div>
  );
}

function Answer({ it, onAsk, busy }) {
  const l = LIGHT[it.light] || LIGHT.red;
  return (
    <article style={{ marginTop: 20, background: '#fff', border: '1px solid #dfe3ea', borderRadius: 12, padding: '14px 16px' }}>
      <p style={{ margin: 0, fontWeight: 600 }}>{it.question}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', margin: '8px 0 4px', fontSize: 13 }}>
        <span title={it.confidence_reason} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: l.bg, color: l.fg, padding: '3px 10px', borderRadius: 999, fontWeight: 600 }}>
          <span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: '50%', background: l.dot }} />{l.label} · {it.confidence} %
        </span>
        <span style={{ color: '#6b7385' }}>{it.level.toUpperCase()} · {it.seconds} s</span>
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.55 }}><ReactMarkdown>{it.answer}</ReactMarkdown></div>
      {it.contradictions && (
        <p style={{ background: '#fff4e0', color: '#8a4b06', padding: '8px 10px', borderRadius: 8, fontSize: 14 }}><strong>Widerspruch in den Quellen:</strong> {it.contradictions}</p>
      )}
      {it.light !== 'green' && it.confidence_reason && (
        <p style={{ fontSize: 13, color: '#6b7385', margin: '6px 0' }}>Warum diese Einstufung: {it.confidence_reason}</p>
      )}
      {it.suggestions?.length > 0 && (
        <div style={{ margin: '8px 0' }}>
          <p style={{ fontSize: 13, color: '#6b7385', margin: '0 0 4px' }}>Meinst du vielleicht …</p>
          {it.suggestions.map((s) => (
            <button key={s} type="button" disabled={busy} onClick={() => onAsk(s)}
              style={{ display: 'inline-block', margin: '0 6px 6px 0', padding: '5px 10px', border: '1px solid #cfd5df', borderRadius: 999, background: '#f7f8fa', fontSize: 13, cursor: 'pointer', color: '#1d2433' }}>{s}</button>
          ))}
        </div>
      )}
      {it.contact && <p style={{ fontSize: 14, margin: '6px 0' }}><strong>Ansprechstelle:</strong> {it.contact}</p>}
      {it.sources?.length > 0 && (
        <details style={{ marginTop: 8, fontSize: 13 }} open={it.level !== 'instant'}>
          <summary style={{ cursor: 'pointer', color: '#2f5bea' }}>Quellen ({it.sources.length})</summary>
          <ul style={{ margin: '6px 0 0', paddingLeft: 18, color: '#3d4556' }}>
            {it.sources.map((s) => (
              <li key={s.doc_id + s.section}><strong>{s.title}</strong> – {s.section}<span style={{ color: '#6b7385' }}>{s.owner ? ` · Owner: ${s.owner}` : ''}{s.version ? ` · Stand ${s.version}` : ''}</span></li>
            ))}
          </ul>
        </details>
      )}
      <p style={{ fontSize: 11, color: '#8a90a0', margin: '10px 0 0' }}>KI-generiert ({it.model}) – Quellen prüfen, bevor du dich darauf stützt.</p>
    </article>
  );
}
