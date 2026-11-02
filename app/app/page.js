import Shell from '../components/Shell';
import Chat from '../components/Chat';

export default function Home() {
  return (
    <Shell>
      <h1 className="page-title">Briefing</h1>
      <p className="page-sub">Kompaktes Wissen zu Prozessen, Schnittstellen und Fachthemen – mit Quellen und Konfidenz-Ampel.</p>
      <Chat />
    </Shell>
  );
}
