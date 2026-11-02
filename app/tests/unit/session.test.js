// Anmeldung: signierte Sitzung, Passwort-Hashes, Rollen
import { describe, it, expect, vi, afterEach } from 'vitest';
import { signSession, readSession, ROLES, ROLE_LABEL } from '../../lib/session';
import { hashPassword, checkPassword, ASSIGNABLE, BOOTSTRAP } from '../../lib/users';
import { req, cookieFor } from '../helpers';
import { NextRequest } from 'next/server';

const user = { id: 3, username: 'lisa01', display_name: 'Lisa Front', role: 'user' };

describe('Sitzung (HMAC-Cookie)', () => {
  afterEach(() => vi.useRealTimers());

  it('eine signierte Sitzung wird wieder gelesen', async () => {
    const s = await readSession(await req('/', { user }));
    expect(s).toMatchObject({ uid: 3, u: 'lisa01', r: 'user' });
  });
  it('ohne Cookie gibt es keine Sitzung', async () => {
    expect(await readSession(await req('/'))).toBeNull();
  });
  it('eine manipulierte Rolle macht die Signatur ungültig', async () => {
    const [payload, sig] = (await signSession(user)).split('.');
    const forged = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(payload, 'base64url')), r: 'admin' })).toString('base64url');
    const r = new NextRequest('https://briefing.test/', { headers: { cookie: `session=${forged}.${sig}` } });
    expect(await readSession(r)).toBeNull();
  });
  it('Müll im Cookie führt nicht zu einem Fehler', async () => {
    const r = new NextRequest('https://briefing.test/', { headers: { cookie: 'session=abc.def' } });
    expect(await readSession(r)).toBeNull();
  });
  it('die Sitzung läuft nach 12 Stunden ab', async () => {
    const cookie = await cookieFor(user);
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 12 * 3600 * 1000 + 1000);
    const r = new NextRequest('https://briefing.test/', { headers: { cookie } });
    expect(await readSession(r)).toBeNull();
  });
});

describe('Passwörter (scrypt)', () => {
  it('Hash ist gesalzen und prüfbar', () => {
    const a = hashPassword('Geheim123'); const b = hashPassword('Geheim123');
    expect(a).not.toBe(b);
    expect(a).not.toContain('Geheim123');
    expect(checkPassword('Geheim123', a)).toBe(true);
    expect(checkPassword('geheim123', a)).toBe(false);
  });
  it('leerer oder kaputter Hash wird abgelehnt', () => {
    expect(checkPassword('x', '')).toBe(false);
    expect(checkPassword('x', null)).toBe(false);
    expect(checkPassword('x', 'nur-ein-teil')).toBe(false);
  });
});

describe('Rollenmodell', () => {
  it('Rangfolge User < Super-User < KI-PM < Admin', () => {
    expect(ROLES.user < ROLES.superuser && ROLES.superuser < ROLES.kipm && ROLES.kipm < ROLES.admin).toBe(true);
  });
  it('jede Rolle hat eine Bezeichnung', () => {
    for (const r of Object.keys(ROLES)) expect(ROLE_LABEL[r]).toBeTruthy();
  });
  it('Admin kann nicht vergeben werden, es gibt ihn nur als Start-Zugang', () => {
    expect(ASSIGNABLE).not.toContain('admin');
    expect(BOOTSTRAP).toMatchObject({ id: 0, username: 'admin', role: 'admin' });
  });
});
