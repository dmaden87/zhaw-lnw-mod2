import Shell from '../../components/Shell';
import Link from 'next/link';
import { db } from '../../lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Wissensbasis – Briefing-Bot (Demo)' };

export default async function Wissensbasis() {
  let docs = [];
  let error = '';
  try {
    docs = await db().query(
      `SELECT d.id, d.title, d.category, d.owner, d.version, count(c.id)::int AS chunks
         FROM documents d LEFT JOIN chunks c ON c.doc_id = d.id
        GROUP BY d.id ORDER BY d.category, d.id`);
  } catch {
    error = 'Die Wissensbasis konnte nicht geladen werden.';
  }
  const total = docs.reduce((s, d) => s + d.chunks, 0);
  return (
    <Shell>
      <h1 className="page-title">Wissensbasis</h1>
      <p className="page-sub">{error || `${docs.length} Dokumente, ${total} Abschnitte – Grundlage aller Antworten.`}</p>
      {!error && (
        <table className="doc-table">
          <thead><tr><th>ID</th><th>Dokument</th><th className="hide-m">Kategorie</th><th className="hide-m">Owner</th><th className="hide-m">Stand</th></tr></thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id}>
                <td><Link href={`/dokument/${d.id}`}><strong>{d.id}</strong></Link></td>
                <td><Link href={`/dokument/${d.id}`}>{d.title.replace(`${d.id} `, '')}</Link></td>
                <td className="hide-m">{d.category}</td>
                <td className="hide-m">{d.owner || '–'}</td>
                <td className="hide-m">{d.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Shell>
  );
}
