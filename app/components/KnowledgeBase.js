'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { IconUpload, IconExternalLink } from '@tabler/icons-react';

const CATEGORIES = ['Prozess', 'Arbeitsanweisung', 'Leitfaden', 'Weisung', 'Systemhandbuch', 'Schnittstelle', 'Produktblatt', 'Meeting-Protokoll', 'Organisation', 'Compliance-Prozess', 'Risk-Prozess', 'Sonstiges'];
const today = () => new Date().toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function KnowledgeBase({ initialDocs }) {
  const [docs, setDocs] = useState(initialDocs);
  const [filter, setFilter] = useState('');
  const [showUpload, setShowUpload] = useState(false);
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
      const res = await fetch(`/api/documents/${encodeURIComponent(d.id)}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ active: next }) });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg(`${d.id} ist jetzt ${next ? 'aktiv und wird wieder konsultiert' : 'inaktiv und wird nicht mehr konsultiert'}.`);
      setDocs((all) => all.map((x) => (x.id === d.id ? { ...x, busy: false } : x)));
    } catch (e) {
      setMsg(`Änderung fehlgeschlagen: ${e.message}`);
      setDocs((all) => all.map((x) => (x.id === d.id ? { ...x, active: d.active, busy: false } : x)));
    }
  }

  return (
    <div>
      <p className="page-sub">{active.length} von {docs.length} Dokumenten aktiv · {active.reduce((s, d) => s + d.chunks, 0)} Abschnitte werden durchsucht.</p>
      <div className="kb-bar">
        <input type="search" placeholder="Dokument suchen, z. B. PAY-02 oder Instant" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Dokumente filtern" />
        <button type="button" className="btn-primary" onClick={() => setShowUpload((v) => !v)} aria-expanded={showUpload}>
          <IconUpload size={16} stroke={1.8} style={{ verticalAlign: -3, marginRight: 6 }} aria-hidden="true" />Dokument hochladen
        </button>
      </div>
      {showUpload && <Upload docs={docs} onDone={(m) => { setMsg(m); setShowUpload(false); router.refresh(); setTimeout(() => window.location.reload(), 300); }} />}
      {msg && <p className="note" role="status">{msg}</p>}

      <table className="doc-table">
        <thead><tr><th>ID</th><th>Dokument</th><th className="hide-m">Kategorie</th><th className="hide-m">Owner · Stand</th><th>Status</th></tr></thead>
        <tbody>
          {shown.map((d) => (
            <tr key={d.id} className={d.active ? '' : 'inactive'}>
              <td><strong>{d.id}</strong>{d.source === 'upload' && <span className="tag">neu</span>}</td>
              <td>
                <a href={`/dokument/${encodeURIComponent(d.id)}`} target="_blank" rel="noopener noreferrer" className="doc-link">
                  {d.title.replace(`${d.id} `, '')}<IconExternalLink size={13} stroke={1.8} style={{ verticalAlign: -2, marginLeft: 4 }} aria-label="öffnet in neuem Tab" />
                </a>
                <div className="src-meta">{d.chunks} Abschnitte</div>
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

function Upload({ docs, onDone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('Prozess');
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');

  function onFile(e) {
    const f = e.target.files?.[0];
    if (f && !title) setTitle(f.name.replace(/\.[^.]+$/, '').replace(/^[A-Z]+-\d+[_ ]*/, '').replace(/_/g, ' '));
    const m = f?.name.match(/^([A-Z]{2,6}-\d{1,3})/);
    if (m && !id) setId(m[1]);
  }

  async function submit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const file = form.get('file');
    if (!file || !file.size) { setError('Wähle eine Datei aus.'); return; }
    if (!/^[A-Za-z]{2,6}-\d{1,3}$/.test(id.trim())) { setError('Die Dokument-ID muss dem Muster «PAY-11» entsprechen.'); return; }
    if (docs.some((d) => d.id === id.trim().toUpperCase())) { setError(`Die ID ${id.toUpperCase()} ist bereits vergeben.`); return; }
    if (!title.trim()) { setError('Gib einen Titel ein.'); return; }
    setBusy(true); setError('');
    try {
      const res = await fetch('/api/documents', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onDone(`${data.title} wurde hochgeladen: ${data.chunks} Abschnitte, ab sofort durchsuchbar.`);
    } catch (err) {
      setError(err.message || 'Upload fehlgeschlagen.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card upload" onSubmit={submit}>
      <h2 className="upload-title">Neues Dokument hochladen</h2>
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
