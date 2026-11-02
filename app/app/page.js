import Chat from '../components/Chat';

export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px 64px' }}>
      <p style={{ color: '#6b7385', fontSize: 13, margin: 0 }}>Gletscherbank AG · interne Demo</p>
      <h1 style={{ fontSize: 26, margin: '6px 0 4px' }}>Briefing-Bot</h1>
      <p style={{ margin: '0 0 18px', color: '#3d4556', fontSize: 15 }}>
        Kompaktes Wissen zu Prozessen, Schnittstellen und Fachthemen – mit Quellen und Konfidenz-Ampel.
      </p>
      <Chat />
      <p style={{ color: '#8a90a0', fontSize: 12, marginTop: 40 }}>
        Du sprichst mit einer KI. Fiktive Musterbank für die CAS-Projektarbeit (ZHAW) – keine echten Daten.
      </p>
    </main>
  );
}
