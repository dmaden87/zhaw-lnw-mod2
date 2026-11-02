// Wandelt hochgeladene Dateien (Word, PDF, Markdown, Text) in Markdown um.
import mammoth from 'mammoth';
import TurndownService from 'turndown';
import { extractText, getDocumentProxy } from 'unpdf';

function turndown() {
  const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' });
  const cell = (n) => td.turndown(n.innerHTML || '').replace(/\n+/g, ' ').replace(/\|/g, '\\|').trim();
  td.addRule('table', {
    filter: 'table',
    replacement: (_, node) => {
      const rows = Array.from(node.querySelectorAll('tr')).map((tr) => Array.from(tr.children).map(cell));
      if (!rows.length) return '';
      const cols = Math.max(...rows.map((r) => r.length));
      const line = (r) => `| ${Array.from({ length: cols }, (_, i) => r[i] || '').join(' | ')} |`;
      return `\n\n${line(rows[0])}\n| ${Array(cols).fill('---').join(' | ')} |\n${rows.slice(1).map(line).join('\n')}\n\n`;
    },
  });
  return td;
}

export async function toMarkdown(filename, buffer) {
  const ext = filename.toLowerCase().split('.').pop();
  if (ext === 'docx') {
    const { value } = await mammoth.convertToHtml({ buffer });
    return turndown().turndown(value);
  }
  if (ext === 'pdf') {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return text.replace(/\n{3,}/g, '\n\n');
  }
  if (ext === 'md' || ext === 'txt') return buffer.toString('utf8');
  throw new Error('Dateityp nicht unterstützt. Erlaubt sind Word (.docx), PDF, Markdown (.md) und Text (.txt).');
}
