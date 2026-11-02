import Shell from '../../components/Shell';
import Settings from '../../components/Settings';

export const metadata = { title: 'Einstellungen – Briefing-Bot (Demo)' };

export default function Einstellungen() {
  return (
    <Shell>
      <h1 className="page-title">Einstellungen</h1>
      <p className="page-sub">Antwortquellen des Bots und Zähler der Schutzmechanismen. Nur für den Admin.</p>
      <Settings />
    </Shell>
  );
}
