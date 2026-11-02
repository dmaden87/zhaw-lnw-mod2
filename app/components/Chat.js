'use client';
import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { IconSearch, IconArrowRight } from '@tabler/icons-react';

const LEVELS = [
  { key: 'instant', label: 'Instant', hint: '5–10 Sek.' },
  { key: 'basic', label: 'Basic', hint: '≤ 3 Min.' },
  { key: 'full', label: 'Full', hint: '≤ 15 Min.' },
];
const LIGHT = { green: 'Sicher', yellow: 'Ziemlich sicher', red: 'Unsicher' };
const EXAMPLES = [
  'Was ist der camt-Standard?',
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
    if (!text) { setError('Gib zuerst eine Frage ein.'); inputRef.current?.focus(); return; }
    if (busy) return;
    setError(''); setBusy(true);
    const t0 = Date.now();
    try {
      const res = await fetch('/api/ask', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question: text, level: lvl }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Die Antwort konnte nicht erzeugt werden.');
      setItems((prev) => [{ ...data, seconds: ((Date.now() - t0) / 1000).toFixed(1).replace('.', ',') }, ...prev]);
      setQuestion('');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <form className="search" onSubmit={(e) => { e.preventDefault(); ask(); }}>
        <IconSearch size={18} stroke={1.8} color="#6b7a8f" style={{ marginTop: 9, flex: 'none' }} aria-hidden="true" />
        <textarea ref={inputRef} rows={1} value={question} aria-label="Frage" placeholder="Was ist der camt-Standard?"
          onChange={(e) => { setQuestion(e.target.value); if (error) setError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } }} />
        <button type="submit" className="btn-primary" aria-busy={busy}>{busy ? 'Suche …' : 'Briefing holen'}</button>
      </form>
      {error && <p className="err" role="alert">{error}</p>}

      <div className="pills" role="radiogroup" aria-label="Detailstufe">
        {LEVELS.map((l) => (
          <button key={l.key} type="button" role="radio" aria-checked={level === l.key} className="pill" onClick={() => setLevel(l.key)}>
            {l.label} <small>{l.hint}</small>
          </button>
        ))}
      </div>

      {items.length === 0 && (
        <div>
          <p className="label">Beispiele</p>
          <div className="examples">
            {EXAMPLES.map((ex) => (
              <button key={ex} type="button" className="example" onClick={() => ask(ex)}>
                <IconArrowRight size={15} stroke={1.8} color="#6b7a8f" aria-hidden="true" />{ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {items.map((it, i) => <Answer key={items.length - i} it={it} onAsk={(q) => ask(q, it.level)} />)}
    </div>
  );
}

function Answer({ it, onAsk }) {
  return (
    <section className="answer" aria-label={`Antwort auf: ${it.question}`}>
      <div className="card">
        <div className="card-head">
          <div>
            <p className="q">{it.question}</p>
            <span className="meta">Antwort · {LEVELS.find((l) => l.key === it.level)?.label} · {it.seconds} s</span>
          </div>
          <span className={`badge ${it.light}`} title={it.confidence_reason}>
            <span className="dot" aria-hidden="true" />{LIGHT[it.light]} · {it.confidence} %
          </span>
        </div>
        <div className="prose"><ReactMarkdown>{it.answer}</ReactMarkdown></div>
        {it.contradictions && <div className="warn"><strong>Widerspruch in den Quellen:</strong> {it.contradictions}</div>}
        {it.light !== 'green' && it.confidence_reason && <p className="reason">Einstufung: {it.confidence_reason}</p>}
        {it.suggestions?.length > 0 && (
          <div className="suggest">
            <p className="label">Meinst du vielleicht …</p>
            {it.suggestions.map((s) => <button key={s} type="button" className="chip" onClick={() => onAsk(s)}>{s}</button>)}
          </div>
        )}
        {it.contact && <p className="contact"><strong>Ansprechstelle:</strong> {it.contact}</p>}
        <p className="ai-note">KI-generiert ({it.model}) – Quellen prüfen, bevor du dich darauf stützt.</p>
      </div>
      {it.sources?.length > 0 && (
        <>
          <p className="label" style={{ margin: '14px 0 0' }}>Quellen</p>
          <div className="sources">
            {it.sources.map((s) => (
              <div className="src" key={s.doc_id + s.section}>
                <div className="src-id">{s.doc_id}</div>
                <div className="src-title">{s.title?.replace(`${s.doc_id} `, '')}</div>
                <div className="src-meta">{s.section}</div>
                {(s.owner || s.version) && <div className="src-meta">{[s.owner, s.version && `Stand ${s.version}`].filter(Boolean).join(' · ')}</div>}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
