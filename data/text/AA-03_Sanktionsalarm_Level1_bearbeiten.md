Gletscherbank AG · Wissensdatenbank Zahlungsverkehr · Arbeitsanweisung

AA-03 Sanktionsalarm Level 1 in ScreenGuard bearbeiten

|                       |                                                                                                                 |
|-----------------------|-----------------------------------------------------------------------------------------------------------------|
| **Gehört zu Prozess** | PAY-08 Sanktions- und Embargoscreening                                                                          |
| **Zielgruppe**        | Compliance Sanktionen, Level-1-Analystinnen und -Analysten                                                      |
| **System**            | ScreenGuard (siehe SH-02)                                                                                       |
| **Verantwortlich**    | Teamleitung Compliance Sanktionen                                                                               |
| **Version / Stand**   | 1.0 / 30.10.2026                                                                                                |
| **Klassifikation**    | Vertraulich                                                                                                     |
| **Hinweis**           | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Namen, Zahlen, Preise, Systeme und Kontakte sind erfunden. |

# 1. Ziel

Alarme aus dem Zahlungsscreening werden innert 2 Stunden (Bürozeiten) beurteilt. Eindeutige Fehlalarme (False Positives) werden mit Begründung geschlossen, alle anderen gehen an Level 2.

# 2. Bildschirmschritte

| **Nr.** | **Bildschirm / Ort**                   | **Aktion**                                                                                                                          | **Ergebnis / Prüfpunkt**                                |
|---------|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------|
| 1       | ScreenGuard › Alert-Übersicht          | Filter «Zahlungen», «Level 1», «Offen». Sortierung «SLA-Restzeit».                                                                  | Dringendste Alarme oben (rot = \< 30 Minuten Restzeit). |
| 2       | Alert › «Übernehmen»                   | Alarm übernehmen. Treffer-Ansicht zeigt Zahlungsfeld, Listeneintrag und Trefferscore.                                               | Alarm ist Ihnen zugewiesen.                             |
| 3       | Alert › Register «Vergleich»           | Getroffenes Feld (Name, Adresse, BIC, Freitext) mit Listeneintrag vergleichen: Geburtsdatum, Nationalität, Adresse, Alias.          | Unterschiede notiert.                                   |
| 4       | KundenCockpit (nur bei eigenem Kunden) | Kundendaten (Geburtsdatum, Wohnsitz) mit Listeneintrag vergleichen.                                                                 | Klare Abweichung oder keine Klärung möglich.            |
| 5       | Alert › «Entscheid»                    | Eindeutig unbegründet: «False Positive» mit Begründung (mind. 2 Unterscheidungsmerkmale). Unklar oder echter Treffer: «An Level 2». | Zahlung wird freigegeben bzw. bleibt im Hold.           |
| 6       | Alert › «Whitelist vorschlagen»        | Nur bei wiederkehrendem Fehlalarm derselben Partei: Vorschlag erfassen. Entscheid trifft Level 2.                                   | Vorschlag in Level-2-Inbox.                             |

# 3. Beispiele für Begründungen

| **Situation**                         | **Gute Begründung**                                                                                                                   |
|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| Namensgleichheit, anderes Geburtsjahr | Kunde geb. 1984, Listeneintrag geb. 1961; Wohnsitz Bern vs. Listeneintrag Damaskus.                                                   |
| Treffer auf Firmennamen-Bestandteil   | «Nordstern Logistik GmbH, Zug» vs. Listeneintrag «Nordstern Shipping Co., Bandar Abbas»; andere Rechtsform, anderes Land, andere UID. |
| Treffer im Freitext auf Ortsnamen     | Freitext «Rechnung Hotel Crimea Lodge, Davos» – Hotelname, kein Bezug zu sanktioniertem Gebiet.                                       |

# 4. Verboten

- Kontakt zum Kunden zur Abklärung eines Treffers ohne Auftrag von Level 2.

- Schliessen ohne Begründung oder mit Standardtext.

- Weitergabe von Trefferdetails an Kundenservice oder Kundenberatung (LF-03).
