export const metadata = { title: 'Anmeldung – Briefing-Bot (Demo)' };

export default async function Login({ searchParams }) {
  const { fehler } = await searchParams;
  return (
    <main style={{ maxWidth: 360, margin: '0 auto', padding: '96px 24px' }}>
      <p style={{ color: '#6b7385', fontSize: 13, margin: 0 }}>Gletscherbank AG · interne Demo</p>
      <h1 style={{ fontSize: 26, margin: '8px 0 24px' }}>Briefing-Bot</h1>
      <form method="post" action="/api/login">
        <label htmlFor="password" style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Demo-Passwort</label>
        <input id="password" name="password" type="password" required autoFocus
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: 16, border: '1px solid #cfd5df', borderRadius: 8 }} />
        {fehler && <p style={{ color: '#b42318', fontSize: 14, margin: '8px 0 0' }}>Passwort falsch. Bitte nochmals versuchen.</p>}
        <button type="submit"
          style={{ marginTop: 16, width: '100%', padding: '10px 12px', fontSize: 16, background: '#2f5bea', color: '#fff', border: 0, borderRadius: 8, cursor: 'pointer' }}>
          Anmelden
        </button>
      </form>
      <p style={{ color: '#6b7385', fontSize: 12, marginTop: 32 }}>Fiktive Musterbank für die CAS-Projektarbeit (ZHAW) – keine echten Daten.</p>
    </main>
  );
}
