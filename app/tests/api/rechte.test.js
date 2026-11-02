// Rollen und Berechtigungen der API-Routen (Datenbank simuliert)
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { req, ADMIN, dbUser } from '../helpers';

const query = vi.fn();
vi.mock('../../lib/db', () => ({ db: () => ({ query, transaction: vi.fn(async () => []) }), toVector: (v) => `[${v}]` }));
vi.mock('../../lib/gemini', () => ({ embed: vi.fn(async (t) => t.map(() => Array(768).fill(0))) }));
const { requireRole } = await import('../../lib/users');
const users = await import('../../app/api/users/route');
const userById = await import('../../app/api/users/[id]/route');
const ratings = await import('../../app/api/ratings/route');
const docs = await import('../../app/api/documents/route');

// Erste DB-Abfrage in requireRole liefert den angemeldeten Benutzer
const als = (role, extra) => query.mockResolvedValueOnce([dbUser(role, extra)]);
beforeEach(() => query.mockReset());

describe('requireRole()', () => {
  it('ohne Sitzung 401', async () => {
    await expect(requireRole(await req('/'), 'user')).rejects.toMatchObject({ status: 401 });
  });
  it('Admin (id 0) braucht keine Datenbank', async () => {
    expect(await requireRole(await req('/', { user: ADMIN }), 'admin')).toMatchObject({ role: 'admin' });
    expect(query).not.toHaveBeenCalled();
  });
  it('gesperrter Benutzer wird sofort abgewiesen, auch mit gültigem Cookie', async () => {
    als('kipm', { active: false });
    await expect(requireRole(await req('/', { user: dbUser('kipm') }), 'user')).rejects.toMatchObject({ status: 403 });
  });
  it('die aktuelle Rolle aus der Datenbank zählt, nicht die im Cookie', async () => {
    als('user'); // im Cookie steht noch kipm, inzwischen herabgestuft
    await expect(requireRole(await req('/', { user: dbUser('kipm') }), 'kipm')).rejects.toMatchObject({ status: 403 });
  });
  it.each([
    ['user', 'user', true], ['user', 'superuser', false],
    ['superuser', 'superuser', true], ['superuser', 'kipm', false],
    ['kipm', 'kipm', true], ['kipm', 'admin', false],
  ])('%s → Mindestrolle %s: erlaubt=%s', async (role, min, ok) => {
    als(role);
    const p = requireRole(await req('/', { user: dbUser(role) }), min);
    if (ok) await expect(p).resolves.toMatchObject({ role }); else await expect(p).rejects.toMatchObject({ status: 403 });
  });
});

describe('Benutzerverwaltung nur für Admin', () => {
  it.each(['user', 'superuser', 'kipm'])('%s darf die Benutzerliste nicht sehen', async (role) => {
    als(role);
    expect((await users.GET(await req('/api/users', { user: dbUser(role) }))).status).toBe(403);
  });
  it('Admin sieht die Liste', async () => {
    query.mockResolvedValueOnce([{ id: 1, username: 'lisa01' }]);
    const r = await users.GET(await req('/api/users', { user: ADMIN }));
    expect(r.status).toBe(200); expect(await r.json()).toHaveLength(1);
  });
  it('KI-PM darf keinen Benutzer anlegen', async () => {
    als('kipm');
    const r = await users.POST(await req('/api/users', { method: 'POST', user: dbUser('kipm'), body: { username: 'neu01', display_name: 'Neu', role: 'user', password: 'Passwort1' } }));
    expect(r.status).toBe(403);
  });
  it('Admin legt Benutzer an; Passwort wird nur gehasht gespeichert', async () => {
    query.mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: 5, username: 'neu01', role: 'user' }]);
    const r = await users.POST(await req('/api/users', { method: 'POST', user: ADMIN, body: { username: 'Neu01', display_name: 'Neu', role: 'user', password: 'Passwort1' } }));
    expect(r.status).toBe(200);
    const params = query.mock.calls[1][1];
    expect(params[0]).toBe('neu01');
    expect(params[3]).not.toContain('Passwort1');
    expect(params[4]).toBe('admin');
  });
  it.each([
    [{ username: 'ab', display_name: 'X', role: 'user', password: 'Passwort1' }, /3–30 Zeichen/],
    [{ username: 'admin', display_name: 'X', role: 'user', password: 'Passwort1' }, /reserviert/],
    [{ username: 'neu01', display_name: '', role: 'user', password: 'Passwort1' }, /Anzeigenamen/],
    [{ username: 'neu01', display_name: 'X', role: 'admin', password: 'Passwort1' }, /User, Super-User oder KI-PM/],
    [{ username: 'neu01', display_name: 'X', role: 'user', password: 'kurz' }, /mindestens 8/],
  ])('ungültige Eingabe wird mit klarer Meldung abgelehnt (%#)', async (body, msg) => {
    const r = await users.POST(await req('/api/users', { method: 'POST', user: ADMIN, body }));
    expect(r.status).toBe(400); expect((await r.json()).error).toMatch(msg);
  });
  it('doppelter Benutzername ergibt 409', async () => {
    query.mockResolvedValueOnce([{ id: 1 }]);
    const r = await users.POST(await req('/api/users', { method: 'POST', user: ADMIN, body: { username: 'lisa01', display_name: 'X', role: 'user', password: 'Passwort1' } }));
    expect(r.status).toBe(409);
  });
  it('Admin kann niemanden zum Admin machen', async () => {
    query.mockResolvedValueOnce([{ id: 3, role: 'user', active: true }]);
    const r = await userById.PATCH(await req('/api/users/3', { method: 'PATCH', user: ADMIN, body: { role: 'admin' } }), { params: Promise.resolve({ id: '3' }) });
    expect(r.status).toBe(400);
  });
  it('Admin sperrt einen Benutzer', async () => {
    query.mockResolvedValueOnce([{ id: 3, role: 'user', active: true }]).mockResolvedValueOnce([{ id: 3, active: false }]);
    const r = await userById.PATCH(await req('/api/users/3', { method: 'PATCH', user: ADMIN, body: { active: false } }), { params: Promise.resolve({ id: '3' }) });
    expect(r.status).toBe(200); expect(query.mock.calls[1][1][2]).toBe(false);
  });
});

describe('Testing-Modus und Wissensbasis', () => {
  it('User und Super-User dürfen keine Bewertungen abgeben', async () => {
    for (const role of ['user', 'superuser']) {
      als(role);
      const r = await ratings.POST(await req('/api/ratings', { method: 'POST', user: dbUser(role), body: { question: 'x', verdict: 'richtig' } }));
      expect(r.status).toBe(403);
    }
  });
  it('User darf keine Dokumente hochladen', async () => {
    als('user');
    const r = await docs.POST(await req('/api/documents', { method: 'POST', user: dbUser('user'), body: {} }));
    expect(r.status).toBe(403);
  });
});
