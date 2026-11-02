Gletscherbank AG · Wissensdatenbank Zahlungsverkehr · Systemhandbuch (Kurzform)

SH-02 ScreenGuard – Sanktions- und Fraud-Screening

|                     |                                                                                                                 |
|---------------------|-----------------------------------------------------------------------------------------------------------------|
| **System-Owner**    | Mirjam Kälin, IT Compliance Systems (fachlich: Lukas Bühler, Compliance Sanktionen)                             |
| **Betrieb**         | 24/7, Echtzeit-Schnittstelle zu PayHub                                                                          |
| **Zugang**          | Nur Compliance und Fraud Desk; Antrag über Leitung Compliance                                                   |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                                |
| **Klassifikation**  | Vertraulich                                                                                                     |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Namen, Zahlen, Preise, Systeme und Kontakte sind erfunden. |

# 1. Wofür ScreenGuard da ist

ScreenGuard prüft jede Zahlung vor Ausführung bzw. Gutschrift gegen Sanktionslisten und gegen Fraud-Regeln. Treffer erzeugen Alarme, die Zahlung bleibt bis zum Entscheid im Status «Compliance Hold» oder «Fraud Hold».

# 2. Geprüfte Daten

- Namen und Adressen von Auftraggeber und Empfänger

- Banken (BIC) entlang der Zahlungskette

- Länder, Städte, Häfen

- Freitext (Zahlungszweck, Mitteilungen)

- Für Fraud: Betrag, neuer Empfänger, Gerät, Uhrzeit, Verhaltensmuster

# 3. Listen

Schweizer Sanktionen (SECO) sowie von der Bank zusätzlich angewendete Listen (u. a. UN, EU, OFAC). Aktualisierung täglich automatisch, bei Eilmeldungen sofort durch Compliance ausgelöst.

# 4. Alarmtypen und Queues

| **Alarmtyp**               | **Queue**                  | **Frist**       |
|----------------------------|----------------------------|-----------------|
| Sanktion – Zahlung         | Level 1 Compliance (AA-03) | 2 Std. Bürozeit |
| Sanktion – eskaliert       | Level 2 Compliance         | 1 Bankwerktag   |
| Fraud – Echtzeit (Instant) | Fraud Desk 24/7            | 15 Min.         |
| Fraud – Standard           | Fraud Desk                 | 2 Std.          |

# 5. Trefferscore

Der Score (0–100) zeigt die Ähnlichkeit zum Listeneintrag. Ab 85 wird ein Alarm erzeugt. Der Score ist kein Entscheid: auch ein Score von 95 kann ein Fehlalarm sein, und Entscheide brauchen immer eine Begründung.

# 6. Whitelist

Wiederkehrende Fehlalarme zu derselben Partei können auf eine Whitelist gesetzt werden. Vorschlag durch Level 1, Entscheid durch Level 2, jährliche Überprüfung aller Einträge.

# 7. Störungen

- Fällt ScreenGuard aus, stoppt PayHub den Versand (Fail-Safe). Keine Zahlung geht ungescreent hinaus.

- Meldung: IT Service Desk «ScreenGuard Support», Priorität 1; Information an Leitung PayOps und Compliance.
