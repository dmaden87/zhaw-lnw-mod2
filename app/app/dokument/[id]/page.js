import Link from 'next/link';
import { notFound } from 'next/navigation';
import Shell from '../../../components/Shell';
import DocView from '../../../components/DocView';
import documents from '../../../data/documents.json';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const d = documents[decodeURIComponent(id)];
  return { title: d ? `${d.title} – Briefing-Bot (Demo)` : 'Dokument nicht gefunden' };
}

export default async function Dokument({ params }) {
  const { id } = await params;
  const d = documents[decodeURIComponent(id)];
  if (!d) notFound();
  // Kopfzeile «Gletscherbank AG · …» und den doppelten Titel aus dem Markdown entfernen
  const lines = d.markdown.split('\n');
  const start = lines.findIndex((l, i) => i > 0 && l.trim() && !l.startsWith('|'));
  const body = start > 0 ? lines.slice(start + 1).join('\n') : d.markdown;
  const github = `https://github.com/dmaden87/zhaw-lnw-mod2/blob/main/${d.path}`;
  return (
    <Shell>
      <p className="meta"><Link href="/wissensbasis">Wissensbasis</Link> › {d.category}</p>
      <h1 className="page-title">{d.title}</h1>
      <p className="page-sub">
        {[d.owner && `Owner: ${d.owner}`, d.version && `Stand ${d.version}`, d.classification].filter(Boolean).join(' · ')}
        {' · '}<a href={github} target="_blank" rel="noopener noreferrer">Original im Repository</a>
      </p>
      <div className="card"><DocView markdown={body} /></div>
    </Shell>
  );
}
