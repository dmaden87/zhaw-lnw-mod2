import Shell from '../../components/Shell';
import KnowledgeBase from '../../components/KnowledgeBase';
import { db } from '../../lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Wissensbasis – Briefing-Bot (Demo)' };

export default async function Wissensbasis() {
  let docs = [];
  let error = '';
  try {
    docs = await db().query(
      `SELECT d.id, d.title, d.category, d.owner, d.version, d.classification, d.active, d.source, count(c.id)::int AS chunks
         FROM documents d LEFT JOIN chunks c ON c.doc_id = d.id
        GROUP BY d.id ORDER BY d.source DESC, d.category, d.id`);
  } catch {
    error = 'Die Wissensbasis konnte nicht geladen werden.';
  }
  return (
    <Shell>
      <h1 className="page-title">Wissensbasis</h1>
      {error ? <p className="err">{error}</p> : <KnowledgeBase initialDocs={docs} />}
    </Shell>
  );
}
