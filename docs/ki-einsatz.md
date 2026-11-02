# Deklaration KI-Einsatz

**Stand:** 02.11.2026 · **Verantwortlich:** Deniz (Tech Lead) · **Gilt für:** Leistungsnachweis 2, CAS ZHAW Modul 2

Dies ist eine Schularbeit. Wir legen offen, wo und wie wir generative KI eingesetzt haben. Für alle Inhalte in diesem Repository ist das Team verantwortlich: Deniz, JJ und Peri.

## 1. Eingesetztes Werkzeug

| | |
| --- | --- |
| **Werkzeug** | Claude von Anthropic, in der Claude-App mit Werkzeugen für Dateien, Code, GitHub und Vercel |
| **Modell** | Claude Opus 5.5 (`claude-opus-5-5`) |
| **Genutzt von** | Deniz; Interview-Runden zum AI-Canvas mit dem ganzen Team |
| **Zeitraum** | ab 01.11.2026, laufend |
| **Nachweis im Repository** | Commits, an denen Claude mitgearbeitet hat, tragen die Zeile `Co-Authored-By: Claude Opus 5.5` (`git log`) |

Nicht zu verwechseln mit der **KI im Produkt**: Der Briefing-Bot selbst nutzt Google Gemini für Embeddings und Antworten (siehe [modellwahl.md](modellwahl.md)). Claude hat beim Erarbeiten und Programmieren geholfen und ist nicht Teil der Lösung.

## 2. Wer hat was gemacht

| Bereich | Team (Entscheid, Inhalt, Prüfung) | Claude (Ausarbeitung) |
| --- | --- | --- |
| Aufgabenstellung | gelesen und eingeordnet | Zusammenfassung der Aufgabenstellung (Safari.pdf) |
| Projektidee und Use Case | Idee, Problem, Zielgruppe, Beispiele aus dem Arbeitsalltag | Strukturierung, Vorschlag für das Vorgehen |
| AI-Canvas | alle Antworten in fünf Interview-Runden, Gewichtung, Freigabe | Moderation der Interviews, Formulierung, HTML-Vorlage |
| Wissensbasis | 60 fiktive Dokumente der Gletscherbank bereitgestellt | 3 Schnittstellen-Dokumente IF-01 bis IF-03 (fiktiv) auf Wunsch des Teams, Aufbereitung in Abschnitte |
| Projektplan, Task-Liste | Rollen, Verfügbarkeiten, Meilensteine, Freigabe | Entwurf und Ausarbeitung |
| Technische Entscheide | Wahl von KI-Anbieter, Modellen, Datenbank, Design-Konzept, Rollenkonzept und Funktionsumfang | Optionen mit Vor- und Nachteilen, Empfehlung, Live-Messungen |
| Programmierung | Anforderungen, Abnahme in der laufenden App, Testbenutzer | gesamter Code (Next.js-App, Datenbank, Import, Suche, Ampel, Rollen, Tests), Konfiguration von Vercel |
| Infrastruktur | Konten (GitHub, Vercel, Neon, Google), Freigaben, Zugangsdaten und Budget | Einrichtung über die freigegebenen Schnittstellen |
| Dokumentation | Review, Korrekturen | Lösungsdokumentation, Journal, Modellwahl, Testkonzept, PDFs |
| Testing | **fachliches Testing durch JJ** (Testkatalog, Bewertungen im Testing-Modus), Auswertung mit Peri | automatisierte Tests (Unit, API, Live-Regression) |
| Präsentation und Reflexion | Inhalt, Auftritt, Reflexion zu Modul 2 | allenfalls Entwürfe, gekennzeichnet |

## 3. Wie wir mit KI-Ergebnissen umgegangen sind

- **Prüfen statt übernehmen:** Wir haben Funktionen in der laufenden App getestet. Fachinhalte prüft JJ gegen die Wissensbasis, Governance-Aspekte prüft Peri.
- **Belegen statt behaupten:** Aussagen zur Qualität stützen sich auf Messungen. Dazu gehören Testläufe ([testkonzept.md](testkonzept.md)), Live-Tests der Modelle und Bewertungen im Testing-Modus.
- **Keine echten Daten:** Wir haben Claude nur fiktive Daten der Gletscherbank gegeben. Zugangsdaten wurden nicht in den Chat kopiert, sie liegen nur als geschützte Variablen in Vercel.
- **Entscheide bleiben beim Team:** Wo Claude Varianten vorgeschlagen hat, hat das Team gewählt. Beispiele sind Modell, Design, Rollen und Admin-Konzept, siehe [journal.md](journal.md).

## 4. Erkenntnis für die Reflexion

Mit einem KI-Assistenten konnte ein Team ohne Vollzeit-Entwickler in zwei Tagen einen funktionsfähigen Prototyp mit Tests bauen. Der Engpass verschiebt sich dadurch vom Programmieren zu drei Aufgaben: klare Anforderungen formulieren, Entscheide treffen und Ergebnisse prüfen. Genau das ist der Inhalt unserer Rollen als Projektleiterin, Product Manager und Tech Lead.
