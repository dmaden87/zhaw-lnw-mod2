'use client';
import { useState, useEffect } from 'react';
import { IconFlask, IconLock } from '@tabler/icons-react';
import { requestJson } from '../lib/clientFetch';

export default function TestModeBar({ active, setActive, summary }) {
  const [asking, setAsking] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    requestJson('/api/test-mode').then((d) => setActive(d.active)).catch(() => {});
  }, [setActive]);

  async function toggle() {
    if (active) {
      await requestJson('/api/test-mode', { method: 'DELETE' }).catch(() => {});
      setActive(false);
      return;
    }
    setAsking((v) => !v); setError('');
  }

  async function confirm(e) {
    e.preventDefault();
    if (!password) { setError('Gib das Passwort ein.'); return; }
    setBusy(true); setError('');
    try {
      await requestJson('/api/test-mode', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) });
      setActive(true); setAsking(false); setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`testbar${active ? ' on' : ''}`}>
      <div className="testbar-row">
        <span className="testbar-title"><IconFlask size={16} stroke={1.8} aria-hidden="true" />Testing- und Adjustment-Modus</span>
        {active && summary && (
          <span className="testbar-sum">Bewertet: {summary.richtig} richtig · {summary.teilweise} teilweise · {summary.falsch} falsch</span>
        )}
        <label className="switch">
          <input type="checkbox" checked={active} onChange={toggle} aria-label="Testing- und Adjustment-Modus" />
          <span className="slider" aria-hidden="true" />
          <span className="switch-label">{active ? 'Ein' : 'Aus'}</span>
        </label>
      </div>
      {asking && !active && (
        <form className="testbar-form" onSubmit={confirm}>
          <IconLock size={16} stroke={1.8} color="#6b7a8f" aria-hidden="true" />
          <input type="password" autoFocus placeholder="Passwort erneut eingeben" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} aria-label="Passwort" />
          <button type="submit" className="btn-primary" aria-busy={busy}>{busy ? 'Prüfe …' : 'Aktivieren'}</button>
          {error && <p className="err" role="alert" style={{ flexBasis: '100%' }}>{error}</p>}
        </form>
      )}
    </div>
  );
}

const VERDICTS = [
  { key: 'richtig', label: 'Richtig' },
  { key: 'teilweise', label: 'Teilweise richtig' },
  { key: 'falsch', label: 'Falsch' },
];

export function RatingPanel({ question, level, data, onSaved }) {
  const [verdict, setVerdict] = useState('');
  const [comment, setComment] = useState('');
  const [correction, setCorrection] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(null);

  async function save() {
    if (!verdict) { setError('Wähle zuerst eine Bewertung.'); return; }
    if (correction.trim() && correction.trim().length < 20) { setError('Das ergänzende Wissen ist sehr kurz. Formuliere es als ganzen Satz (mindestens 20 Zeichen).'); return; }
    setBusy(true); setError('');
    try {
      const r = await requestJson('/api/ratings', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question, level, model: data.model, answer: data.answer, confidence: data.confidence, light: data.light,
          sources: data.sources?.map((s) => ({ doc_id: s.doc_id, section: s.section })), verdict, comment, correction }),
      });
      setSaved(r); onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (saved) {
    return (
      <div className="rating saved" role="status">
        Bewertung «{VERDICTS.find((v) => v.key === verdict).label}» gespeichert.
        {saved.docId && <> Ergänzung als <a href={`/dokument/${saved.docId}`} target="_blank" rel="noopener noreferrer">{saved.docId}</a> in der Wissensbasis – stelle die Frage erneut, um die verbesserte Antwort zu sehen.</>}
      </div>
    );
  }
  return (
    <div className="rating">
      <p className="label" style={{ margin: '0 0 6px' }}>Antwort bewerten ({level})</p>
      <div className="verdicts" role="radiogroup" aria-label="Bewertung">
        {VERDICTS.map((v) => (
          <button key={v.key} type="button" role="radio" aria-checked={verdict === v.key} className={`verdict ${v.key}`} onClick={() => { setVerdict(v.key); setError(''); }}>{v.label}</button>
        ))}
      </div>
      <textarea rows={2} placeholder="Kommentar (optional), z. B. was fehlt oder falsch ist" value={comment} onChange={(e) => setComment(e.target.value)} aria-label="Kommentar" />
      <textarea rows={3} placeholder="Ergänzendes Wissen (optional) – wird als neues Dokument in die Wissensbasis aufgenommen, z. B. «Der Timeout für Instant Payments beträgt 800 ms; danach …»" value={correction} onChange={(e) => { setCorrection(e.target.value); setError(''); }} aria-label="Ergänzendes Wissen" />
      {error && <p className="err" role="alert">{error}</p>}
      <button type="button" className="btn-primary" onClick={save} aria-busy={busy}>{busy ? 'Speichere …' : correction.trim() ? 'Bewertung und Wissen speichern' : 'Bewertung speichern'}</button>
    </div>
  );
}
