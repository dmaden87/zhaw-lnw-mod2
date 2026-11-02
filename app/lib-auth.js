// Gemeinsame Hilfsfunktion: Cookie-Wert = SHA-256 des Demo-Passworts (Passwort selbst wird nie gespeichert).
export async function authToken(password) {
  const data = new TextEncoder().encode('briefing-bot:' + password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
export const COOKIE = 'demo_auth';
