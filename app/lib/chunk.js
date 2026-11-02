// Teilt Markdown entlang der Kapitel in Abschnitte von max. ca. 1'500 Zeichen (gleiche Logik wie db/build_chunks.py).
const MAX = 1500;

function splitTable(block) {
  const lines = block.split('\n');
  if (lines.length < 3 || block.length <= MAX) return [block];
  const head = lines.slice(0, 2); const parts = []; let cur = [];
  for (const row of lines.slice(2)) {
    if (cur.length && [...head, ...cur, row].join('\n').length > MAX) { parts.push([...head, ...cur].join('\n')); cur = []; }
    cur.push(row);
  }
  if (cur.length) parts.push([...head, ...cur].join('\n'));
  return parts;
}

function chunkSection(content) {
  const pieces = [];
  for (const b of content.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)) {
    if (b.startsWith('|')) pieces.push(...splitTable(b));
    else if (b.length > MAX) pieces.push(...(b.match(new RegExp(`[\\s\\S]{1,${MAX}}(?=\\s|$)`, 'g')) || [b]));
    else pieces.push(b);
  }
  const out = []; let cur = '';
  for (const p of pieces) {
    if (cur && cur.length + p.length + 2 > MAX) { out.push(cur); cur = p; } else cur = cur ? `${cur}\n\n${p}` : p;
  }
  if (cur) out.push(cur);
  return out;
}

export function chunkMarkdown(markdown) {
  const sections = []; let heading = 'Übersicht'; let buf = [];
  for (const line of markdown.split('\n')) {
    const m = line.match(/^#{1,3}\s+(.+)/);
    if (m) { if (buf.join('').trim()) sections.push([heading, buf.join('\n')]); heading = m[1].replace(/\*\*/g, '').replace(/\\([.\-*_#()])/g, '$1').trim(); buf = []; }
    else buf.push(line);
  }
  if (buf.join('').trim()) sections.push([heading, buf.join('\n')]);
  const chunks = [];
  for (const [section, content] of sections) chunkSection(content.trim()).forEach((text, i) => chunks.push({ section, part: i + 1, content: text }));
  return chunks;
}
