'use client';
import { useEffect, useState } from 'react';
import { IconUserPlus, IconX } from '@tabler/icons-react';
import { requestJson } from '../lib/clientFetch';
import { useMe } from '../lib/useMe';

const ROLES = [
  { key: 'user', label: 'User', hint: 'Suchen, Dokumente lesen' },
  { key: 'superuser', label: 'Super-User', hint: '+ Dokumente hochladen, ersetzen, aktivieren' },
  { key: 'kipm', label: 'KI-PM', hint: '+ Antworten bewerten und verfeinern, Wissen ergänzen (Testing-Modus)' },
];
const fmt = (d) => (d ? new Date(d).toLocaleString('de-CH', { dateStyle: 'short', timeStyle: 'short' }) : '–');

export default function UserAdmin() {
  const me = useMe();
  const [users, setUsers] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [resetFor, setResetFor] = useState(null);

  useEffect(() => {
    requestJson('/api/users').then(setUsers).catch((e) => setError(e.message));
  }, []);

  async function patch(u, body, text) {
    try {
      const row = await requestJson(`/api/users/${u.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      setUsers((all) => all.map((x) => (x.id === u.id ? row : x)));
      setMsg({ type: 'ok', text });
      return true;
    } catch (e) {
      setMsg({ type: 'error', text: `${u.username}: ${e.message}` });
      return false;
    }
  }

  if (error) return <p className="note error" role="alert">{error}</p>;
  if (!users) return <p className="page-sub">Lade Benutzer …</p>;
  return (
    <div>
      <div className="kb-bar" style={{ justifyContent: 'space-between' }}>
        <span className="src-meta" style={{ alignSelf: 'center' }}>{users.filter((u) => u.active).length} aktive Benutzer · Benutzer «admin» (Rolle Admin) verwaltet die Benutzer und darf alles</span>
        <button type="button" className="btn-primary" onClick={() => setShowNew((v) => !v)} aria-expanded={showNew}>
          <IconUserPlus size={16} stroke={1.8} style={{ verticalAlign: -3, marginRight: 6 }} aria-hidden="true" />Benutzer anlegen
        </button>
      </div>
      {showNew && <NewUser onCancel={() => setShowNew(false)} onDone={(u) => { setUsers((all) => [...all, u].sort((a, b) => a.username.localeCompare(b.username))); setShowNew(false); setMsg({ type: 'ok', text: `${u.display_name} (${u.username}) wurde als ${ROLES.find((r) => r.key === u.role).label} angelegt.` }); }} />}
      {resetFor && <ResetPassword user={resetFor} onCancel={() => setResetFor(null)} onSave={async (pw) => { if (await patch(resetFor, { password: pw }, `Passwort von ${resetFor.username} wurde geändert.`)) setResetFor(null); }} />}
      {msg && <p className={msg.type === 'error' ? 'note error' : 'note'} role={msg.type === 'error' ? 'alert' : 'status'}>{msg.text}</p>}

      {users.length === 0 ? (
        <div className="card"><strong>Noch keine Benutzer angelegt.</strong><p className="src-meta" style={{ margin: '4px 0 0' }}>Lege für JJ, Peri und weitere Personen je einen Benutzer mit passender Rolle an.</p></div>
      ) : (
        <table className="doc-table">
          <thead><tr><th>Benutzer</th><th>Rolle</th><th className="hide-m">Letzte Anmeldung</th><th>Status</th></tr></thead>
          <tbody>
            {users.map((u) => {
              const self = me && me.id === u.id;
              return (
                <tr key={u.id} className={u.active ? '' : 'inactive'}>
                  <td><strong>{u.display_name}</strong>{self && <span className="tag">du</span>}<div className="src-meta">{u.username} · <button type="button" className="link-btn" onClick={() => setResetFor(u)}>Passwort ändern</button></div></td>
                  <td>
                    <select value={u.role} disabled={self} aria-label={`Rolle von ${u.username}`}
                      onChange={(e) => patch(u, { role: e.target.value }, `${u.username} ist jetzt ${ROLES.find((r) => r.key === e.target.value).label}.`)}>
                      {ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
                    </select>
                  </td>
                  <td className="hide-m">{fmt(u.last_login)}</td>
                  <td>
                    <label className="switch" title={self ? 'Du kannst dich nicht selbst sperren' : u.active ? 'Sperren' : 'Entsperren'}>
                      <input type="checkbox" checked={u.active} disabled={self} onChange={() => patch(u, { active: !u.active }, `${u.username} ist jetzt ${u.active ? 'gesperrt' : 'wieder aktiv'}.`)} aria-label={`${u.username} ${u.active ? 'sperren' : 'entsperren'}`} />
                      <span className="slider" aria-hidden="true" />
                      <span className="switch-label">{u.active ? 'Aktiv' : 'Gesperrt'}</span>
                    </label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div className="card" style={{ marginTop: 16 }}>
        <p className="label" style={{ margin: '0 0 6px' }}>Rollen</p>
        {ROLES.map((r) => <p key={r.key} style={{ margin: '0 0 4px', fontSize: 14 }}><strong>{r.label}:</strong> {r.hint}</p>)}
        <p style={{ margin: 0, fontSize: 14 }}><strong>Admin:</strong> alles inkl. Benutzerverwaltung (nur der Benutzer «admin»)</p>
      </div>
    </div>
  );
}

function NewUser({ onDone, onCancel }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    if (!/^[a-z0-9._-]{3,30}$/.test(String(f.username).trim().toLowerCase())) { setError('Der Benutzername braucht 3–30 Zeichen: Kleinbuchstaben, Ziffern, Punkt, Bindestrich oder Unterstrich.'); return; }
    if (String(f.password).length < 8) { setError('Das Passwort braucht mindestens 8 Zeichen.'); return; }
    setBusy(true); setError('');
    try {
      onDone(await requestJson('/api/users', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(f) }));
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return (
    <form className="card upload" onSubmit={submit}>
      <div className="upload-head"><h2 className="upload-title">Neuer Benutzer</h2><button type="button" className="icon-btn" onClick={onCancel} aria-label="Schliessen"><IconX size={18} stroke={1.8} /></button></div>
      <div className="form-grid">
        <label>Benutzername<input name="username" placeholder="peri" autoComplete="off" required /></label>
        <label>Anzeigename<input name="display_name" placeholder="Peri" required /></label>
        <label>Rolle
          <select name="role" defaultValue="user">{ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}</select>
        </label>
        <label className="full">Erstes Passwort (mind. 8 Zeichen, der Person persönlich mitteilen)<input name="password" type="password" autoComplete="new-password" required /></label>
      </div>
      {error && <p className="err" role="alert">{error}</p>}
      <button type="submit" className="btn-primary" aria-busy={busy} style={{ marginTop: 12 }}>{busy ? 'Lege an …' : 'Benutzer anlegen'}</button>
    </form>
  );
}

function ResetPassword({ user, onSave, onCancel }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  return (
    <form className="card upload" onSubmit={(e) => { e.preventDefault(); if (pw.length < 8) { setError('Das Passwort braucht mindestens 8 Zeichen.'); return; } onSave(pw); }}>
      <div className="upload-head"><h2 className="upload-title">Passwort ändern: {user.display_name}</h2><button type="button" className="icon-btn" onClick={onCancel} aria-label="Schliessen"><IconX size={18} stroke={1.8} /></button></div>
      <div className="form-grid"><label className="full">Neues Passwort (mind. 8 Zeichen)<input type="password" autoComplete="new-password" value={pw} onChange={(e) => { setPw(e.target.value); setError(''); }} /></label></div>
      {error && <p className="err" role="alert">{error}</p>}
      <button type="submit" className="btn-primary" style={{ marginTop: 12 }}>Passwort speichern</button>
    </form>
  );
}
