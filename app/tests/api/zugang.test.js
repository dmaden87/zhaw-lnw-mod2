// Zugangsschutz (proxy.js) und Login (/api/login)
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hashPassword } from '../../lib/users';
import { req, ADMIN, dbUser } from '../helpers';

const query = vi.fn();
vi.mock('../../lib/db', () => ({ db: () => ({ query }) }));
const { proxy } = await import('../../proxy');
const { POST: login } = await import('../../app/api/login/route');

beforeEach(() => query.mockReset());

describe('Proxy: ohne Anmeldung kein Zugriff', () => {
  it('Seiten leiten auf /login um', async () => {
    const r = await proxy(await req('/wissensbasis'));
    expect(r.status).toBe(307);
    expect(r.headers.get('location')).toBe('https://briefing.test/login');
  });
  it('APIs antworten mit 401 und verständlicher Meldung', async () => {
    const r = await proxy(await req('/api/ask', { method: 'POST' }));
    expect(r.status).toBe(401);
    expect((await r.json()).error).toMatch(/Anmeldung ist abgelaufen/);
  });
  it('Login-Seite und Login-API sind offen', async () => {
    for (const p of ['/login', '/api/login']) expect((await proxy(await req(p))).headers.get('x-middleware-next')).toBe('1');
  });
  it('mit gültiger Sitzung geht es weiter', async () => {
    expect((await proxy(await req('/', { user: dbUser('user') }))).headers.get('x-middleware-next')).toBe('1');
  });
  it('Admin-Endpunkte brauchen das ADMIN_TOKEN – eine Sitzung genügt nicht', async () => {
    expect((await proxy(await req('/api/admin/ask', { user: ADMIN }))).status).toBe(401);
    expect((await proxy(await req('/api/admin/ask?token=falsch'))).status).toBe(401);
    expect((await proxy(await req('/api/admin/ask?token=token-test'))).headers.get('x-middleware-next')).toBe('1');
    expect((await proxy(await req('/api/admin/ask', { headers: { 'x-admin-token': 'token-test' } }))).headers.get('x-middleware-next')).toBe('1');
  });
});

describe('Login', () => {
  const ziel = (r) => r.headers.get('location');

  it('admin mit ADMIN_PASSWORD meldet an und setzt ein sicheres Cookie', async () => {
    const r = await login(await req('/api/login', { method: 'POST', form: { username: 'Admin ', password: 'admin-test-pw' } }));
    expect(r.status).toBe(303);
    expect(ziel(r)).toBe('https://briefing.test/');
    const c = r.headers.get('set-cookie');
    expect(c).toMatch(/session=/); expect(c).toMatch(/HttpOnly/i); expect(c).toMatch(/Secure/i);
    expect(query).not.toHaveBeenCalled();
  });
  it('admin mit falschem Passwort wird abgewiesen', async () => {
    const r = await login(await req('/api/login', { method: 'POST', form: { username: 'admin', password: 'falsch' } }));
    expect(ziel(r)).toMatch(/fehler=falsch/);
  });
  it('leere Felder ergeben einen Hinweis', async () => {
    const r = await login(await req('/api/login', { method: 'POST', form: { username: '', password: '' } }));
    expect(ziel(r)).toMatch(/fehler=leer/);
  });
  it('Datenbank-Benutzer mit richtigem Passwort meldet an und Letzte Anmeldung wird gesetzt', async () => {
    query.mockResolvedValueOnce([{ ...dbUser('kipm'), password_hash: hashPassword('Passwort1') }]).mockResolvedValueOnce([]);
    const r = await login(await req('/api/login', { method: 'POST', form: { username: 'kipm01', password: 'Passwort1' } }));
    expect(ziel(r)).toBe('https://briefing.test/');
    expect(query.mock.calls[1][0]).toMatch(/last_login = now\(\)/);
  });
  it('gesperrte Benutzer erhalten einen eigenen Hinweis', async () => {
    query.mockResolvedValueOnce([{ ...dbUser('user', { active: false }), password_hash: hashPassword('Passwort1') }]);
    const r = await login(await req('/api/login', { method: 'POST', form: { username: 'user01', password: 'Passwort1' } }));
    expect(ziel(r)).toMatch(/fehler=gesperrt/);
  });
  it('unbekannte Benutzer: gleiche Meldung wie falsches Passwort (keine Aufzählung)', async () => {
    query.mockResolvedValueOnce([]);
    const r = await login(await req('/api/login', { method: 'POST', form: { username: 'gibtsnicht', password: 'x' } }));
    expect(ziel(r)).toMatch(/fehler=falsch/);
  });
  it('Datenbankausfall ergibt «technik» statt Absturz', async () => {
    query.mockRejectedValueOnce(new Error('DB weg'));
    const r = await login(await req('/api/login', { method: 'POST', form: { username: 'user01', password: 'x' } }));
    expect(ziel(r)).toMatch(/fehler=technik/);
  });
});
