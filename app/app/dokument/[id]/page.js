import Link from 'next/link';
import { notFound } from 'next/navigation';
import Shell from '../../../components/Shell';
import DocView from '../../../components/DocView';
import documents from '../../../data/documents.json';
import { db } from '../../../lib/db';

export const dynamic = 'force-dynamic';

async function load(id) {
  try {
    const [row] = await db().query('SELECT id, title, category, owner, version, classification, path, markdown, active, source FROM documents WHERE id = $1', [id]);
    if (row) return { ...row, markdown: row.markdown || documents[id]?.markdown || '' };
  } catch {}
  return documents[id] ? { ...documents[id], active: true, source: 'repo' } : null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const d = await load(decodeURIComponent(id));
  return { title: d ? `${d.title} – Briefing-Bot (Demo)` : 'Dokument nicht gefunden' };
}

export default async function Dokument({ params }) {
  const { id } = await params;
  const d = await load(decodeURIComponent(id));
  if (!d) notFound();
  // Bei Repository-Dokumenten Kopfzeile «Gletscherbank AG · …» und den doppelten Titel entfernen
  const lines = d.markdown.split('\n');
  const start = lines[0].startsWith('Gletscherbank AG') ? lines.findIndex((l, i) => i > 0 && l.trim() && !l.startsWith('|')) : -1;
  const body = start > 0 ? lines.slice(start + 1).join('\n') : d.markdown;
  const github = d.source === 'repo' ? `https://github.com/dmaden87/zhaw-lnw-mod2/blob/main/${d.path}` : null;
  return (
    <Shell>
      <p className="meta"><Link href="/wissensbasis">Wissensbasis</Link> › {d.category}</p>
      <h1 className="page-title">{d.title}</h1>
      <p className="page-sub">
        {[d.owner && `Owner: ${d.owner}`, d.version && `Stand ${d.version}`, d.classification].filter(Boolean).join(' · ')}
        {github && <>{' · '}<a href={github} target="_blank" rel="noopener noreferrer">Original im Repository</a></>}
        {d.source === 'upload' && ` · hochgeladen (${d.path.replace('Upload: ', '')})`}
      </p>
      {!d.active && <p className="warn">Dieses Dokument ist inaktiv und wird bei Antworten nicht berücksichtigt.</p>}
      <div className="card"><DocView markdown={body} /></div>
    </Shell>
  );
}
