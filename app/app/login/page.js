import { IconMountain } from '@tabler/icons-react';

export const metadata = { title: 'Anmeldung – Briefing-Bot (Demo)' };

export default async function Login({ searchParams }) {
  const { fehler } = await searchParams;
  const MSG = {
    falsch: 'Benutzername oder Passwort stimmt nicht.',
    leer: 'Gib Benutzername und Passwort ein.',
    gesperrt: 'Dein Benutzer ist gesperrt. Wende dich an den KI-PM.',
    technik: 'Die Anmeldung ist gerade nicht möglich. Versuche es in einigen Minuten nochmals.',
  };
  return (
    <main className="login">
      <div className="login-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <span className="logo" style={{ background: 'var(--navy)', color: '#fff' }}><IconMountain size={19} stroke={1.8} aria-hidden="true" /></span>
          <span><strong style={{ fontSize: 16 }}>Gletscherbank</strong><br /><span style={{ fontSize: 13, color: 'var(--muted)' }}>Briefing-Bot · interne Demo</span></span>
        </div>
        <form method="post" action="/api/login">
          <label htmlFor="username" style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Benutzername</label>
          <input id="username" name="username" autoComplete="username" autoCapitalize="none" required autoFocus />
          <label htmlFor="password" style={{ display: 'block', fontSize: 14, margin: '12px 0 6px' }}>Passwort</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          {fehler && <p className="err" role="alert">{MSG[fehler] || MSG.falsch}</p>}
          <button type="submit" className="btn-primary">Anmelden</button>
        </form>
        <p style={{ color: 'var(--muted)', fontSize: 12, margin: '22px 0 0' }}>Fiktive Musterbank für die CAS-Projektarbeit (ZHAW) – keine echten Daten.</p>
      </div>
    </main>
  );
}
