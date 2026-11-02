Gletscherbank AG · Wissensdatenbank Zahlungsverkehr · Meeting-Protokoll

MP-01 Weekly PayOps vom 19. Oktober 2026

|                     |                                                                                                                 |
|---------------------|-----------------------------------------------------------------------------------------------------------------|
| **Datum / Zeit**    | 19.10.2026, 09:00–09:45 Uhr                                                                                     |
| **Ort**             | Microsoft Teams                                                                                                 |
| **Leitung**         | Marco Steiner (Leitung PayOps)                                                                                  |
| **Protokoll**       | Lea Huber                                                                                                       |
| **Teilnehmende**    | Nina Frei, Daniel Gerber, Reto Baumann, Aylin Demir, Claudia Roth, Adrian Vogel (IT Payments)                   |
| **Abwesend**        | Patrick Weber (Ferien)                                                                                          |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                                |
| **Klassifikation**  | Intern                                                                                                          |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Namen, Zahlen, Preise, Systeme und Kontakte sind erfunden. |

# Traktanden

1.  Kennzahlen Vorwoche

2.  Vorbereitung strukturierte Adressen ab 14.11.2026

3.  Repair-Queue: Rückstau und Personal

4.  Varia

# 1. Kennzahlen Vorwoche

- STP-Quote Inland 96,4 % (Ziel ≥ 97 %). Hauptgrund: Zunahme von R-ADR-02 «Ort/Land fehlt» bei Firmenkunden-Dateien.

- Repair-Queue: durchschnittliche Bearbeitungszeit 2 Std. 40 Min. (Ziel ≤ 2 Std.).

- Instant: Verfügbarkeit 99,97 %, keine Störung.

- Rückrufe: 41 neu, davon 6 mit Betrugsbezug (an Fraud Desk übergeben).

# 2. Strukturierte Adressen ab 14.11.2026

Reto Baumann berichtet: Rund 18 % der SWIFT-Aufträge von Firmenkunden enthalten noch keine strukturierte Adresse mit Ort und Land. Ab 14.11.2026 drohen Abweisungen durch Korrespondenzbanken. Adrian Vogel bestätigt, dass PayHub ab 14.11. unvollständige Auslandzahlungen automatisch in die Repair-Queue leitet statt sie zu versenden.

# 3. Repair-Queue

Nina Frei rechnet ab Mitte November mit doppeltem Volumen in der Repair-Queue. Diskutiert wurden eine Verschiebung des Cut-offs und ein temporäres Sonderteam. Eine Verschiebung des Cut-offs wurde verworfen, weil sie Kunden verunsichern würde.

# Entscheide

| **Nr.** | **Entscheid**                                                                                                                                            | **Gültig ab / Status** |
|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|
| E1      | Für die Zeit vom 10.11. bis 19.12.2026 wird ein Sonderteam «Adressen» mit 3 Personen aus PayOps Inland und International gebildet. Leitung: Aylin Demir. | ab 10.11.2026          |
| E2      | Der Cut-off für Inlandzahlungen bleibt bei 15:00 Uhr, für SEPA bei 14:00 Uhr. Keine Änderung wegen des Adress-Stichtags.                                 | bestätigt              |
| E3      | Corporate Banking Services kontaktiert die 50 Firmenkunden mit den meisten unvollständigen Auslandaufträgen bis 7.11.2026 aktiv.                         | beauftragt             |
| E4      | Für Korrekturen von Adressen im Sonderteam gilt weiterhin das Vier-Augen-Prinzip gemäss WE-02. Keine Ausnahme.                                           | bestätigt              |

# Pendenzen

| **Pendenz**                                                                    | **Wer**      | **Bis**    |
|--------------------------------------------------------------------------------|--------------|------------|
| Liste der 50 Firmenkunden an Corporate Banking Services liefern                | Reto Baumann | 23.10.2026 |
| Einsatzplan Sonderteam «Adressen» erstellen                                    | Aylin Demir  | 30.10.2026 |
| Repair-Fehlercode R-ADR-02 im Dashboard separat ausweisen                      | Adrian Vogel | 06.11.2026 |
| Kurzschulung Kundenservice zu strukturierten Adressen organisieren (mit LF-05) | Claudia Roth | 07.11.2026 |

# Nächstes Meeting

Weekly PayOps, Montag 26.10.2026, 09:00 Uhr.
