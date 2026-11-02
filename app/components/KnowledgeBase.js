'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconUpload, IconExternalLink, IconReplace, IconX } from '@tabler/icons-react';
import { requestJson, fileProblem } from '../lib/clientFetch';

const CATEGORIES = ['Prozess', 'Arbeitsanweisung', 'Leitfaden', 'Weisung', 'Systemhandbuch', 'Schnittstelle', 'Produktblatt', 'Meeting-Protokoll', 'Organisation', 'Compliance-Prozess', 'Risk-Prozess', 'Sonstiges'];
const today = () => new Date().toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function KnowledgeBase({ initialDocs }) {
  const [docs, setDocs] = useState(initialDocs);
  const [filter, setFilter] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [replacing, setReplacing] = useState(null);
  useEffect(() => setDocs(initialDocs), [initialDocs]);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const active = docs.filter((d) => d.active);
  const shown = useMemo(() => {
    const f = filter.trim().toLowerCase();
    return f ? docs.filter((d) => `${d.id} ${d.title} ${d.category} ${d.owner}`.toLowerCase().includes(f)) : docs;
  }, [docs, filter]);

  async function toggle(d) {
    const next = !d.active;
    setDocs((all) => all.map((x) => (x.id === d.id ? { ...x, active: next, busy: true } : x)));
    try {
      await requestJson(`/api/documents/${encodeURIComponent(d.id)}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ active: next }) });
      setMsg({ type: 'ok', text: `${d.id} ist jetzt ${next ? 'aktiv und wird wieder konsultiert' : 'inaktiv und wird nicht mehr konsultiert'}.` });
      setDocs((all) => all.map((x) => (x.id === d.id ? { ...x, busy: false } : x)));
    } catch (e) {
      setMsg({ type: 'error', text: `${d.id} konnte nicht geändert werden: ${e.message}` });
      setDocs((all) => all.map((x) => (x.id === d.id ? { ...x, active: d.active, busy: false } : x)));
    }
  }

  return (
    <div>
      <p className="page-sub">{active.length} von {docs.length} Dokumenten aktiv · {active.reduce((s, d) => s + d.chunks, 0)} Abschnitte werden durchsucht.</p>
      <div className="kb-bar">
        <input type="search" placeholder="Dokument suchen, z. B. PAY-02 oder Instant" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Dokumente filtern" />
        <button type="button" className="btn-primary" onClick={() => { setShowUpload((v) => !v); setReplacing(null); }} aria-expanded={showUpload}>
          <IconUpload size={16} stroke={1.8} style={{ verticalAlign: -3, marginRight: 6 }} aria-hidden="true" />Dokument hochladen
        </button>
      </div>
      {showUpload && <Upload docs={docs} onCancel={() => setShowUpload(false)} onDone={(m) => { setMsg({ type: 'ok', text: m }); setShowUpload(false); router.refresh(); }} />}
      {replacing && <Replace doc={replacing} onCancel={() => setReplacing(null)} onDone={(m) => { setMsg({ type: 'ok', text: m }); setReplacing(null); router.refresh(); }} />}
      {msg && <p className={msg.type === 'error' ? 'note error' : 'note'} role={msg.type === 'error' ? 'alert' : 'status'}>{msg.text}</p>}

      <table className="doc-table">
        <thead><tr><th>ID</th><th>Dokument</th><th className="hide-m">Kategorie</th><th className="hide-m">Owner · Stand</th><th>Status</th></tr></thead>
        <tbody>
          {shown.map((d) => (
            <tr key={d.id} className={d.active ? '' : 'inactive'}>
              <td><strong>{d.id}</strong>{d.source === 'upload' && <span className="tag">{d.path?.startsWith('Ersetzt') ? 'ersetzt' : 'neu'}</span>}</td>
              <td>
                <a href={`/dokument/${encodeURIComponent(d.id)}`} target="_blank" rel="noopener noreferrer" className="doc-link">
                  {d.title.replace(`${d.id} `, '')}<IconExternalLink size={13} stroke={1.8} style={{ verticalAlign: -2, marginLeft: 4 }} aria-label="öffnet in neuem Tab" />
                </a>
                <div className="src-meta">{d.chunks} Abschnitte · <button type="button" className="link-btn" onClick={() => { setReplacing(d); setShowUpload(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><IconReplace size={13} stroke={1.8} style={{ verticalAlign: -2, marginRight: 3 }} aria-hidden="true" />Ersetzen</button></div>
              </td>
              <td className="hide-m">{d.category}</td>
              <td className="hide-m">{d.owner || '–'}<div className="src-meta">{d.version}</div></td>
              <td>
                <label className="switch" title={d.active ? 'Inaktivieren' : 'Aktivieren'}>
                  <input type="checkbox" checked={d.active} disabled={d.busy} onChange={() => toggle(d)} aria-label={`${d.id} ${d.active ? 'inaktivieren' : 'aktivieren'}`} />
                  <span className="slider" aria-hidden="true" />
                  <span className="switch-label">{d.active ? 'Aktiv' : 'Inaktiv'}</span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Upload({ docs, onDone, onCancel }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('Prozess');
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');

  function onFile(e) {
    const f = e.target.files?.[0];
    setError(fileProblem(f));
    if (f && !title) setTitle(f.name.replace(/\.[^.]+$/, '').replace(/^[A-Z]+-\d+[_ ]*/, '').replace(/_/g, ' '));
    const m = f?.name.match(/^([A-Z]{2,6}-\d{1,3})/);
    if (m && !id) setId(m[1]);
  }

  async function submit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const file = form.get('file');
    const problem = fileProblem(file);
    if (problem) { setError(problem); return; }
    if (!/^[A-Za-z]{2,6}-\d{1,3}$/.test(id.trim())) { setError('Die Dokument-ID muss dem Muster «PAY-11» entsprechen.'); return; }
    if (docs.some((d) => d.id === id.trim().toUpperCase())) { setError(`Die ID ${id.toUpperCase()} ist bereits vergeben.`); return; }
    if (!title.trim()) { setError('Gib einen Titel ein.'); return; }
    setBusy(true); setError('');
    try {
      const data = await requestJson('/api/documents', { method: 'POST', body: form });
      onDone(`${data.title} wurde hochgeladen: ${data.chunks} Abschnitte, ab sofort durchsuchbar.`);
    } catch (err) {
      setError(err.message || 'Upload fehlgeschlagen.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card upload" onSubmit={submit}>
      <div className="upload-head"><h2 className="upload-title">Neues Dokument hochladen</h2><button type="button" className="icon-btn" onClick={onCancel} aria-label="Schliessen"><IconX size={18} stroke={1.8} /></button></div>
      <p className="src-meta" style={{ margin: '0 0 12px' }}>Word (.docx), PDF, Markdown oder Text, max. 4 MB. Das Dokument wird aufbereitet, in Abschnitte geteilt und ist danach sofort durchsuchbar.</p>
      <div className="form-grid">
        <label className="full">Datei<input type="file" name="file" accept=".docx,.pdf,.md,.txt" onChange={onFile} required /></label>
        <label>Dokument-ID<input name="id" value={id} onChange={(e) => setId(e.target.value)} placeholder="PAY-11" required /></label>
        <label>Kategorie
          <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <label className="full">Titel<input name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Instant Payment in EUR (SEPA Inst)" required /></label>
        <label>Owner<input name="owner" placeholder="Payment Operations (PayOps)" /></label>
        <label>Version / Stand<input name="version" defaultValue={`1.0 / ${today()}`} /></label>
        <label>Klassifikation
          <select name="classification" defaultValue="Intern"><option>Intern</option><option>Vertraulich</option></select>
        </label>
      </div>
      {error && <p className="err" role="alert">{error}</p>}
      <button type="submit" className="btn-primary" aria-busy={busy} style={{ marginTop: 12 }}>{busy ? 'Wird aufbereitet …' : 'Hochladen und einlesen'}</button>
    </form>
  );
}

function Replace({ doc, onDone, onCancel }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const problem = fileProblem(form.get('file'));
    if (problem) { setError(problem); return; }
    setBusy(true); setError('');
    try {
      const data = await requestJson(`/api/documents/${encodeURIComponent(doc.id)}`, { method: 'PUT', body: form });
      onDone(`${data.title} wurde ersetzt: ${data.chunks} Abschnitte neu eingelesen. Die alte Fassung wird nicht mehr verwendet.`);
    } catch (err) {
      setError(`${err.message}${/nichts verändert/.test(err.message) ? '' : ' Die bisherige Fassung bleibt unverändert.'}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card upload" onSubmit={submit}>
      <div className="upload-head"><h2 className="upload-title">Dokument ersetzen: {doc.id}</h2><button type="button" className="icon-btn" onClick={onCancel} aria-label="Schliessen"><IconX size={18} stroke={1.8} /></button></div>
      <p className="src-meta" style={{ margin: '0 0 12px' }}>{doc.title.replace(`${doc.id} `, '')} · aktuell {doc.version || 'ohne Version'}. ID, Titel, Kategorie und Status bleiben; Inhalt und Abschnitte werden durch die neue Datei ersetzt.</p>
      <div className="form-grid">
        <label className="full">Neue Fassung<input type="file" name="file" accept=".docx,.pdf,.md,.txt" required onChange={(e) => setError(fileProblem(e.target.files?.[0]))} /></label>
        <label>Neue Version / Stand<input name="version" placeholder={doc.version || '1.1 / ' + today()} /></label>
        <label>Owner<input name="owner" defaultValue={doc.owner || ''} /></label>
      </div>
      {error && <p className="err" role="alert">{error}</p>}
      <button type="submit" className="btn-primary" aria-busy={busy} style={{ marginTop: 12 }}>{busy ? 'Wird ersetzt …' : 'Ersetzen und neu einlesen'}</button>
    </form>
  );
}
