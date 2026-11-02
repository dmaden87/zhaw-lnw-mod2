// Bewertung einer Antwort (richtig / teilweise / falsch) und optional ergänzendes Wissen.
// Ergänzungen werden als eigenes Dokument (KOR-nnn) eingebettet und sind sofort durchsuchbar.
import { db, toVector } from '../../../lib/db';
import { isTestMode } from '../../../lib-auth';
import { processMarkdown, errorResponse, UserError } from '../../../lib/ingestFile';
import { embed } from '../../../lib/gemini';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const VERDICTS = ['richtig', 'teilweise', 'falsch'];

export async function GET(request) {
  try {
    if (!(await isTestMode(request))) throw new UserError('Der Testing-Modus ist nicht aktiv.', 403);
    const rows = await db().query(`SELECT verdict, count(*)::int AS n FROM ratings GROUP BY verdict`);
    const summary = Object.fromEntries(VERDICTS.map((v) => [v, rows.find((r) => r.verdict === v)?.n || 0]));
    return Response.json(summary);
  } catch (e) {
    return errorResponse(e, 'ratings-summary');
  }
}

export async function POST(request) {
  try {
    if (!(await isTestMode(request))) throw new UserError('Der Testing-Modus ist abgelaufen oder nicht aktiv. Schalte ihn oben wieder ein.', 403);
    const b = await request.json().catch(() => { throw new UserError('Die Bewertung konnte nicht gelesen werden. Versuche es nochmals.'); });
    if (!VERDICTS.includes(b.verdict)) throw new UserError('Wähle «richtig», «teilweise richtig» oder «falsch».');
    if (!b.question) throw new UserError('Zur Bewertung fehlt die Frage. Lade die Seite neu.');
    const correction = String(b.correction || '').trim();
    if (correction && correction.length < 20) throw new UserError('Das ergänzende Wissen ist sehr kurz. Formuliere es als ganzen Satz (mindestens 20 Zeichen).');
    if (correction.length > 8000) throw new UserError('Das ergänzende Wissen ist zu lang (höchstens 8000 Zeichen). Lade längere Texte als Dokument in der Wissensbasis hoch.');

    const sql = db();
    let docId = null;
    if (correction) {
      const [{ n }] = await sql.query(`SELECT COALESCE(MAX(substring(id from 5)::int), 0) + 1 AS n FROM documents WHERE id ~ '^KOR-[0-9]+$'`);
      if (n > 999) throw new UserError('Es gibt bereits 999 Ergänzungen. Fasse bestehende zusammen.');
      docId = `KOR-${String(n).padStart(3, '0')}`;
      const title = `${docId} Ergänzung zu: ${String(b.question).slice(0, 120)}`;
      const markdown = `# Ergänztes Wissen\n\n${correction}\n\n# Hintergrund\n\nErfasst im Testing- und Adjustment-Modus am ${new Date().toLocaleDateString('de-CH')} zur Frage «${b.question}» (Bewertung der Antwort: ${b.verdict}).`;
      const { chunks } = await processMarkdown(markdown, title);
      const [{ next }] = await sql.query('SELECT GREATEST(COALESCE(MAX(id), 0), 99999) + 1 AS next FROM chunks');
      await sql.transaction([
        sql.query(
          `INSERT INTO documents (id, title, category, owner, version, classification, path, markdown, source, active, updated_at)
           VALUES ($1,$2,'Ergänzung (Testing)','Testing-Modus',$3,'Intern','Testing-Modus',$4,'testing',true,now())`,
          [docId, title, `1.0 / ${new Date().toLocaleDateString('de-CH')}`, markdown]),
        ...chunks.map((c, i) => sql.query(
          'INSERT INTO chunks (id, doc_id, section, part, content, embed_text, hash, embedding) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::vector)',
          [next + i, docId, c.section, c.part, c.content, c.embed_text, c.hash, toVector(c.vector)])),
      ]);
    }
    // Frage einbetten, damit die Bewertung bei ähnlichen Fragen die Ampel kalibriert
    let qVector = null;
    try { [qVector] = await embed([b.question], 'RETRIEVAL_QUERY'); } catch { /* Bewertung trotzdem speichern */ }
    await sql.query(
      `INSERT INTO ratings (question, level, model, answer, confidence, light, sources, verdict, comment, correction_doc_id, question_embedding)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10,$11::vector)`,
      [b.question, b.level, b.model, b.answer, b.confidence, b.light, JSON.stringify(b.sources || []), b.verdict, String(b.comment || '').trim() || null, docId, qVector ? toVector(qVector) : null]);
    return Response.json({ ok: true, docId });
  } catch (e) {
    return errorResponse(e, 'rating');
  }
}
