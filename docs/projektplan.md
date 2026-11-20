# LNW 2 – Projektplan Briefing-Bot

**Stand:** 20.11.2026 · **Verantwortlich:** Peri (Projektleitung) · **Original:** Claude-Doc [«LNW 2 – Projektplan Briefing-Bot»](https://claude.ai/artifact/Vc2xaDVg9vkyQ4cEfLzLL6), hier als Kopie im Repository

Dieser Plan übernimmt die Rolle von Project Charter und Zeitplan (Gantt). Budget und Business Case stehen im [AI-Canvas](AI-Canvas.md) (Feld 12) und im [Mengengerüst](mengengeruest.md), die Risiken im [KI-Risiko-Radar](risiko-radar.md) und im AI-Canvas (Feld 11), der Fahrplan nach dem LNW im [Zielbild Betrieb](zielbild-betrieb.md) (Kapitel 9).

## Ausgangslage und Pitch-Rahmen

Am 4. Dezember 2026 präsentieren wir als Projektteam der fiktiven Gletscherbank AG der Geschäftsleitung den PoC «Briefing-Bot» und beantragen den Pilot. Der Bot liefert in Meetings in Sekunden quellenbasiertes Wissen zu Prozessen, Schnittstellen und Fachthemen, in drei Stufen (Instant, Basic, Full) und mit Konfidenz-Ampel.

- **Format:** rund 19 Min. Präsentation (Richtwert 15 Min., bis 25 Min. möglich), ca. 10 Min. Diskussion, max. 5 Min. Reflexion; ausgeglichene Sprechzeit, die Zuteilung der Sprechenden legt das Team fest.
- **Sponsor in der Story:** Thomas Brunner, COO (MP-05). Go/No-Go für den Rollout am KPI-Review Ende März 2027.
- **Grundlage:** AI-Canvas v0.4, Mengengerüst, Zielbild Betrieb, KI-Risiko-Radar und Wissensdatenbank Zahlungsverkehr (60 Dokumente).

## Team und Rollen

Wir sind drei gleichberechtigte Partner; jede Rolle verantwortet ein klar abgegrenztes Ergebnis.

| Person | Rolle | Verantwortet | Liefert ins Repository |
| --- | --- | --- | --- |
| Peri | Projektleiterin (Risk & Compliance) | Plan, Termine, Governance, Risiken, DSFA, EU-AI-Act-Einschätzung, Budget | Projektplan, Risiko-Radar (Mitwirkung), Budget im AI-Canvas |
| JJ | Product Manager (Fachexperte Zahlungsverkehr) | Wissensbasis, Use Cases, Testfragen mit Soll-Antworten, fachliche Abnahme | Wissensdatenbank, Testset, Testauswertung |
| Deniz | Tech Lead (Umsetzung) | Architektur, Web-App, Vektordatenbank, Demo, Business Case | Code, Architektur, Mengengerüst, Dokumentation |

**Hinweis zur Story:** In MP-05 und TR-05 der Wissensdatenbank ist noch «JJ Steinmann (Projektleitung)» eingetragen. Stand 20.11. noch offen: anpassen, damit Rollen und Dokumente übereinstimmen.

## Ablauf der Präsentation

Stand 20.11.2026: sechs Teile, rund 19 Minuten. Die Zuteilung der Sprechenden bespricht das Team; Ziel sind ausgeglichene Sprechzeit und je zwei Personen pro Teil.

| Teil | Inhalt | Dauer |
| --- | --- | --- |
| Einstieg | Titel und Ablauf | 0,5 Min. |
| 1 Ausgangslage | Lisa, Bruno und Tom; drei Zeitfresser rund um Meetings (21'000 Std. pro Jahr); Ziel und KPIs | 4 Min. |
| 2 Lösungsidee und PoC | Zielbild in Teams, drei Detailstufen, Live-Demo | 6 Min. |
| 3 Vom PoC zum Betrieb | Architektur, Fahrplan, Business Case | 3 Min. |
| 4 Compliance und Risiko | KI-Risiko-Radar, Schutzschichten, Compliance-Status | 3,5 Min. |
| 5 Erste Erkenntnisse | drei Erkenntnisse aus PoC und Zielbild | 1,5 Min. |
| 6 Antrag | vier Entscheide an die Geschäftsleitung | 1 Min. |

- **Diskussion (ca. 10 Min.):** Jede Person beantwortet Fragen zu ihrem Gebiet und verweist auf die Dokumente im Repository.
- **Reflexion (max. 5 Min.):** je ca. 1,5 Min. persönliche Key-Takeaways aus Modul 2 und wo sie im LNW eingebaut sind.

## Meilensteine und Zeitplan

JJ liefert Wissensbasis und Soll-Antworten vor den Ferien (M2, 14.11.); während seiner Abwesenheit baut Deniz den PoC fertig und Peri erstellt Governance-Unterlagen und Budget.

| Phase / Meilenstein | Zeitraum |
| --- | --- |
| Konzept und Setup | 01.–08.11.2026 |
| M1 Repo, Charter, Testfragen v1 | 08.11.2026 |
| Wissensbasis und Bau | 09.–22.11.2026 |
| M2 Wissensbasis-Freeze, PoC v0.1 | 14.11.2026 |
| JJ in den Ferien | 15.–26.11.2026 |
| M3 PoC v0.5, Risiken, Gantt, Budget | 22.11.2026 |
| Test und Unterlagen | 23.–29.11.2026 |
| M4 Testauswertung, Folien v1 | 29.11.2026 |
| Proben | 30.11.–03.12.2026 |
| M5 Generalprobe 1 | 01.12.2026 |
| M6 Generalprobe 2, Repo-Freeze | 03.12.2026 |
| **LNW 2 Präsentation** | **04.12.2026** |

Der Testfragen-Katalog bis 30.11. ist auch in MP-05 als Pendenz festgehalten; M4 deckt ihn ab.

**Stand 20.11.2026:** M1 bis M3 erreicht. Der PoC läuft (Beta v0.5 mit Schutzmechanismen und Testautomatisierung); Risiken stehen im KI-Risiko-Radar, Zeitplan und Budget im AI-Canvas (Feld 12), im Mengengerüst und im Zielbild Betrieb (Kapitel 9). Die Folien liegen als Entwurf vor. Der Fachtest ist ausgewertet: 97 % der Antworten korrekt, 100 % richtige Quelle (testkonzept.md, Kapitel 6). Offen für M4: Ampel-Kalibrierung, studentische Learnings und Reflexion.

## Geplanter Aufwand pro Person

Geplant sind je 70 Stunden gemäss ECTS-Richtwert, total 210 Stunden. JJ legt seinen Schwerpunkt vor und nach den Ferien (15.–26.11.).

| Phase | Peri (Std.) | JJ (Std.) | Deniz (Std.) |
| --- | --- | --- | --- |
| Konzept und Setup (bis 8.11.) | 15 | 20 | 10 |
| Wissensbasis und Bau (9.–22.11.) | 25 | 15 | 35 |
| Test und Unterlagen (23.–29.11.) | 15 | 15 | 10 |
| Proben und Präsentation (30.11.–4.12.) | 15 | 20 | 15 |
| **Total** | **70** | **70** | **70** |

## Zusammenarbeit und Ausblick

Wir arbeiten asynchron über GitHub und treffen uns einmal pro Woche kurz.

- **Weekly:** Sonntag, 30 Min., Teams. Agenda: erledigt, nächste Woche, Blocker.
- **Board:** GitHub Project mit den Tasks aus der Task-Liste; jede Person pflegt ihre Karten.
- **Ablage:** Alles Präsentationsrelevante liegt im Repository, damit wir in Präsentation und Diskussion darauf verweisen können.

**Nach dem LNW (Teil der Projektskizze):** Pilot mit 25 Personen ab 11.01.2027, Briefing-Bot und Microsoft 365 Copilot an denselben Muss-Anforderungen gemessen; Begleitmodus ab 01.02.2027; Go/No-Go mit Wahl der Variante am KPI-Review Ende März 2027 (MP-05). Danach V1 mit persönlichen Quellen, Zugang über die Teams-Seitenleiste und eine Windows-App; Option: Lösung als Produkt für weitere Banken.
