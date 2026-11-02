import Shell from '../../components/Shell';
import UserAdmin from '../../components/UserAdmin';

export const metadata = { title: 'Benutzer – Briefing-Bot (Demo)' };

export default function Benutzer() {
  return (
    <Shell>
      <h1 className="page-title">Benutzer</h1>
      <p className="page-sub">Wer darf was? User suchen und lesen · Super-User verwalten zusätzlich Dokumente · KI-PM bewerten Antworten und ergänzen Wissen · Admin verwaltet zusätzlich die Benutzer.</p>
      <UserAdmin />
    </Shell>
  );
}
