// Fetch mit verständlichen Fehlermeldungen für die Oberfläche
const BY_STATUS = {
  401: 'Deine Anmeldung ist abgelaufen. Lade die Seite neu und melde dich erneut an.',
  413: 'Die Datei ist zu gross für den Upload (höchstens 4 MB).',
  429: 'Zu viele Anfragen in kurzer Zeit. Warte einen Moment und versuche es nochmals.',
  502: 'Der Server ist gerade nicht erreichbar. Versuche es in einigen Minuten nochmals.',
  503: 'Der Dienst ist gerade ausgelastet. Versuche es in einer Minute nochmals.',
  504: 'Die Verarbeitung hat zu lange gedauert. Bei sehr grossen Dateien hilft es, sie aufzuteilen.',
};

export async function requestJson(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch {
    throw new Error('Keine Verbindung zum Server. Prüfe deine Internetverbindung und versuche es nochmals.');
  }
  let data = null;
  try { data = await res.json(); } catch { /* keine JSON-Antwort, z. B. Plattformfehler */ }
  if (res.redirected && res.url.includes('/login')) throw new Error(BY_STATUS[401]);
  if (!res.ok) throw new Error(data?.error || BY_STATUS[res.status] || `Unerwarteter Fehler (Code ${res.status}). Versuche es nochmals.`);
  if (!data) throw new Error('Die Antwort des Servers war unvollständig. Versuche es nochmals.');
  return data;
}

export const MAX_BYTES = 4 * 1024 * 1024;
export const ALLOWED = ['docx', 'pdf', 'md', 'txt'];

export function fileProblem(file) {
  if (!file || !file.size) return 'Wähle eine Datei aus.';
  const ext = file.name.toLowerCase().split('.').pop();
  if (!ALLOWED.includes(ext)) return `Dateityp «.${ext}» wird nicht unterstützt. Erlaubt sind Word (.docx), PDF, Markdown (.md) und Text (.txt).`;
  if (file.size > MAX_BYTES) return `Die Datei ist ${(file.size / 1024 / 1024).toFixed(1)} MB gross; erlaubt sind höchstens 4 MB.`;
  return '';
}
