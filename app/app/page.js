export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px' }}>
      <p style={{ color: '#6b7385', fontSize: 13, margin: 0 }}>Gletscherbank AG · interne Demo</p>
      <h1 style={{ fontSize: 28, margin: '8px 0 16px' }}>Briefing-Bot</h1>
      <p>Kompaktes, quellenbasiertes Wissen zu Prozessen, Schnittstellen und Fachthemen – in drei Stufen (Instant, Basic, Full) und mit Konfidenz-Ampel.</p>
      <p style={{ background: '#fff4e0', color: '#b45309', padding: '10px 14px', borderRadius: 8, fontSize: 14 }}>
        PoC im Aufbau. Der Chat folgt in den nächsten Schritten.
      </p>
      <p style={{ color: '#6b7385', fontSize: 12, marginTop: 40 }}>
        KI-generierte Antworten werden gekennzeichnet. Fiktive Musterbank für die CAS-Projektarbeit (ZHAW) – keine echten Daten.
      </p>
    </main>
  );
}
