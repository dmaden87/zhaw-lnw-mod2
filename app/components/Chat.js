'use client';
import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { IconSearch, IconArrowRight, IconTrash } from '@tabler/icons-react';
import { docHref } from '../lib/slug';

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
const fmt = (ms) => (ms / 1000).toFixed(1).replace('.', ',');

export default function Chat() {
  const [level, setLevel] = useState('instant');
  const [question, setQuestion] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const nextId = useRef(1);

  const update = (id, lvl, patch) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, results: { ...it.results, [lvl]: { ...it.results[lvl], ...patch } } } : it)));

  // Eine Frage löst alle drei Stufen parallel aus; angezeigt wird die gewählte Stufe.
  function ask(q) {
    const text = (q ?? question).trim();
    if (!text) { setError('Gib zuerst eine Frage ein.'); inputRef.current?.focus(); return; }
    setError('');
    const id = nextId.current++;
    const t0 = Date.now();
    setItems((prev) => [{ id, question: text, results: Object.fromEntries(LEVELS.map((l) => [l.key, { status: 'load' }])) }, ...prev]);
    setQuestion('');
    LEVELS.forEach(async ({ key }) => {
      try {
        const res = await fetch('/api/ask', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question: text, level: key }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Die Antwort konnte nicht erzeugt werden.');
        update(id, key, { status: 'done', data, seconds: fmt(Date.now() - t0) });
      } catch (e) {
        update(id, key, { status: 'fail', error: e.message });
      }
    });
  }

  const latest = items[0];
  return (
    <div>
      <form className="search" onSubmit={(e) => { e.preventDefault(); ask(); }}>
        <IconSearch size={18} stroke={1.8} color="#6b7a8f" style={{ marginTop: 9, flex: 'none' }} aria-hidden="true" />
        <textarea ref={inputRef} rows={1} value={question} aria-label="Frage" placeholder="Was ist der camt-Standard?"
          onChange={(e) => { setQuestion(e.target.value); if (error) setError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } }} />
        <button type="submit" className="btn-primary">Briefing holen</button>
      </form>
      {error && <p className="err" role="alert">{error}</p>}

      <div className="pills" role="radiogroup" aria-label="Detailstufe anzeigen">
        {LEVELS.map((l) => {
          const st = latest?.results[l.key]?.status;
          return (
            <button key={l.key} type="button" role="radio" aria-checked={level === l.key} className="pill" onClick={() => setLevel(l.key)}>
              {l.label} <small>{st === 'load' ? 'lädt …' : l.hint}</small>
            </button>
          );
        })}
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

      {items.length > 0 && (
        <div className="history-bar">
          <span className="label" style={{ margin: 0 }}>{items.length === 1 ? '1 Frage' : `${items.length} Fragen`} in dieser Sitzung</span>
          <button type="button" className="btn-clear" onClick={() => { setItems([]); setError(''); inputRef.current?.focus(); }}>
            <IconTrash size={15} stroke={1.8} aria-hidden="true" />Verlauf löschen
          </button>
        </div>
      )}

      {items.map((it) => <Answer key={it.id} it={it} level={level} setLevel={setLevel} onAsk={ask} />)}
    </div>
  );
}

function Answer({ it, level, setLevel, onAsk }) {
  const r = it.results[level];
  const a = r?.data;
  return (
    <section className="answer" aria-label={`Antwort auf: ${it.question}`}>
      <div className="card">
        <div className="card-head">
          <div>
            <p className="q">{it.question}</p>
            <div className="vtabs" aria-label="Stufe dieser Antwort">
              {LEVELS.map((l) => {
                const st = it.results[l.key].status;
                return (
                  <button key={l.key} type="button" className="vtab" aria-pressed={level === l.key} onClick={() => setLevel(l.key)}
                    title={st === 'load' ? 'wird erstellt' : st === 'fail' ? 'fehlgeschlagen' : 'bereit'}>
                    <span className={`st ${st}`} aria-hidden="true" />{l.label}{it.results[l.key].seconds ? ` · ${it.results[l.key].seconds} s` : ''}
                  </button>
                );
              })}
            </div>
          </div>
          {a && (
            <span className={`badge ${a.light}`} title={a.confidence_reason}>
              <span className="dot" aria-hidden="true" />{LIGHT[a.light]} · {a.confidence} %
            </span>
          )}
        </div>

        {r.status === 'load' && <div className="skeleton"><span className="spin" aria-hidden="true" />{LEVELS.find((l) => l.key === level).label}-Antwort wird erstellt …</div>}
        {r.status === 'fail' && <p className="err">{r.error}</p>}
        {a && (
          <>
            <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{a.answer}</ReactMarkdown></div>
            {a.contradictions && <div className="warn"><strong>Widerspruch in den Quellen:</strong> {a.contradictions}</div>}
            {a.light !== 'green' && a.confidence_reason && <p className="reason">Einstufung: {a.confidence_reason}</p>}
            {a.suggestions?.length > 0 && (
              <div className="suggest">
                <p className="label">Meinst du vielleicht …</p>
                {a.suggestions.map((s) => <button key={s} type="button" className="chip" onClick={() => onAsk(s)}>{s}</button>)}
              </div>
            )}
            {a.contact && <p className="contact"><strong>Ansprechstelle:</strong> {a.contact}</p>}
            <p className="ai-note">KI-generiert ({a.model}) – Quellen prüfen, bevor du dich darauf stützt.</p>
          </>
        )}
      </div>
      {a?.sources?.length > 0 && (
        <>
          <p className="label" style={{ margin: '14px 0 0' }}>Quellen – öffnen in neuem Tab</p>
          <div className="sources">
            {a.sources.map((s) => (
              <a className="src" key={s.doc_id + s.section} href={docHref(s.doc_id, s.section)} target="_blank" rel="noopener noreferrer"
                aria-label={`${s.doc_id} ${s.title} öffnen, Abschnitt ${s.section}`}>
                <div className="src-id">{s.doc_id}</div>
                <div className="src-title">{s.title?.replace(`${s.doc_id} `, '')}</div>
                <div className="src-meta">{s.section}</div>
                {(s.owner || s.version) && <div className="src-meta">{[s.owner, s.version && `Stand ${s.version}`].filter(Boolean).join(' · ')}</div>}
              </a>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
