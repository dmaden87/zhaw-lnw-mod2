'use client';
import { useEffect, useState } from 'react';
import { requestJson } from '../lib/clientFetch';

export default function Settings() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { requestJson('/api/settings').then(setData).catch((e) => setError(e.message)); }, []);

  async function toggle(value) {
    setBusy(true); setMsg('');
    try {
      const d = await requestJson('/api/settings', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ general_knowledge: value }) });
      setData(d);
      setMsg(value ? 'Allgemeinwissen ist eingeschaltet. Die Änderung gilt spätestens nach 30 Sekunden.' : 'Nur noch Antworten aus der Wissensbasis. Die Änderung gilt spätestens nach 30 Sekunden.');
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  if (error) return <p className="note error" role="alert">{error}</p>;
  if (!data) return <p className="page-sub">Lade Einstellungen …</p>;
  const on = Boolean(data.settings.general_knowledge);
  const total = data.counters.reduce((s, c) => s + c.total, 0);
  return (
    <div>
      <h2 className="section-title">Antwortquellen</h2>
      <div className="card">
        <label className="switch">
          <input type="checkbox" role="switch" checked={on} disabled={busy} onChange={(e) => toggle(e.target.checked)} aria-describedby="gk-hint" />
          <span className="slider" aria-hidden="true" />
          <span className="switch-label"><strong>Allgemeinwissen Payments und Banking</strong> · {on ? 'eingeschaltet' : 'ausgeschaltet'}</span>
        </label>
        <p id="gk-hint" className="src-meta" style={{ margin: '8px 0 0' }}>
          {on
            ? 'Findet sich nichts in der Wissensbasis, darf der Bot allgemeines Fachwissen zu Zahlungsverkehr und Banking ergänzen. Solche Antworten sind gekennzeichnet und höchstens Gelb. Interne Werte (Preise, Limiten, Fristen, Zuständigkeiten) kommen immer nur aus den Dokumenten. Themenfremde Fragen werden nie beantwortet.'
            : 'Der Bot antwortet ausschliesslich aus den Dokumenten der Wissensbasis (reine Kontext-Suche).'}
        </p>
        {msg && <p className="note" role="status">{msg}</p>}
      </div>

      <h2 className="section-title">Schutzmechanismen – Zähler</h2>
      <p className="src-meta">Nur Anzahl pro Tag und Kategorie, keine Fragetexte und keine Personen. {total} Ereignisse seit Beginn.</p>
      <table className="doc-table">
        <thead><tr><th>Kategorie</th><th>Heute</th><th>7 Tage</th><th>Total</th></tr></thead>
        <tbody>
          {data.counters.map((c) => (
            <tr key={c.key}><td>{c.label}</td><td>{c.today}</td><td>{c.last7}</td><td>{c.total}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
