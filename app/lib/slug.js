// Anker für Kapitelüberschriften, z. B. "4. Prozessablauf" -> "4-prozessablauf"
export function slug(text = '') {
  return String(text).toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
export const docHref = (docId, section) =>
  `/dokument/${encodeURIComponent(docId)}${section && section !== 'Übersicht' ? `#${slug(section)}` : ''}`;
