// Fehler, deren Text direkt dem Nutzer angezeigt werden darf, und einheitliche Fehlerantwort
export class UserError extends Error {
  constructor(message, status = 400) { super(message); this.status = status; }
}
export function errorResponse(e, context) {
  if (e instanceof UserError) return Response.json({ error: e.message }, { status: e.status });
  console.error(`[${context}]`, e);
  return Response.json({ error: 'Beim Speichern ist ein unerwarteter Fehler aufgetreten. Es wurde nichts verändert. Versuche es nochmals oder melde dich beim Tech Lead.' }, { status: 500 });
}
