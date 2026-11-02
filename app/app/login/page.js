import { IconMountain } from '@tabler/icons-react';

export const metadata = { title: 'Anmeldung – Briefing-Bot (Demo)' };

export default async function Login({ searchParams }) {
  const { fehler } = await searchParams;
  return (
    <main className="login">
      <div className="login-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <span className="logo" style={{ background: 'var(--navy)', color: '#fff' }}><IconMountain size={19} stroke={1.8} aria-hidden="true" /></span>
          <span><strong style={{ fontSize: 16 }}>Gletscherbank</strong><br /><span style={{ fontSize: 13, color: 'var(--muted)' }}>Briefing-Bot · interne Demo</span></span>
        </div>
        <form method="post" action="/api/login">
          <label htmlFor="password" style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Demo-Passwort</label>
          <input id="password" name="password" type="password" required autoFocus />
          {fehler && <p className="err">Passwort falsch. Bitte nochmals versuchen.</p>}
          <button type="submit" className="btn-primary">Anmelden</button>
        </form>
        <p style={{ color: 'var(--muted)', fontSize: 12, margin: '22px 0 0' }}>Fiktive Musterbank für die CAS-Projektarbeit (ZHAW) – keine echten Daten.</p>
      </div>
    </main>
  );
}
