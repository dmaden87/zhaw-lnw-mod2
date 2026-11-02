Gletscherbank AG · Wissensdatenbank Zahlungsverkehr

PAY-08 Sanktions- und Embargoscreening im Zahlungsverkehr

|                     |                                                                                                          |
|---------------------|----------------------------------------------------------------------------------------------------------|
| **Prozess-ID**      | PAY-08                                                                                                   |
| **Prozesseigner**   | Compliance – Sanktionen                                                                                  |
| **Systeme**         | Screening-Engine, Fallmanagement-Tool, PayHub                                                            |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                         |
| **Klassifikation**  | Intern                                                                                                   |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Interne Zeiten, Limiten und Kontakte sind erfunden. |

# 1. Zweck und Geltungsbereich

Dieser Prozess stellt sicher, dass ein- und ausgehende Zahlungen gegen Sanktionslisten geprüft werden (u. a. Schweizer Sanktionen des SECO sowie von der Bank angewendete internationale Listen wie EU, UN, OFAC). Treffer werden abgeklärt, bevor eine Zahlung ausgeführt oder gutgeschrieben wird.

# 2. Begriffe

| **Begriff**    | **Erklärung**                                                           |
|----------------|-------------------------------------------------------------------------|
| Treffer (Hit)  | Übereinstimmung eines Namens, Landes oder BIC mit einer Sanktionsliste. |
| False Positive | Treffer, der sich nach Abklärung als unbegründet erweist.               |
| True Match     | Bestätigter Treffer; Zahlung wird blockiert und gemeldet.               |
| Whitelisting   | Dokumentierte Freigabe wiederkehrender False Positives.                 |

# 3. Rollen und Verantwortlichkeiten

| **Rolle**                 | **Aufgabe**                                              |
|---------------------------|----------------------------------------------------------|
| Screening-Engine          | Prüft alle Parteien, Banken, Länder und Freitext.        |
| Level-1-Analyst           | Erste Beurteilung, schliesst eindeutige False Positives. |
| Level-2-Compliance        | Entscheidet über unklare Fälle und True Matches.         |
| Geldwäschereibeauftragter | Meldungen an Behörden.                                   |

# 4. Prozessablauf

| **Nr.** | **Schritt**             | **Beschreibung**                                                                                                                 | **Verantwortlich**        | **System**       |
|---------|-------------------------|----------------------------------------------------------------------------------------------------------------------------------|---------------------------|------------------|
| 1       | Automatisches Screening | Jede Zahlung wird vor Ausführung bzw. Gutschrift geprüft; Instant Payments in Echtzeit.                                          | System                    | Screening-Engine |
| 2       | Alarm erzeugen          | Bei Treffer: Zahlung angehalten, Fall im Fallmanagement eröffnet.                                                                | System                    | Fallmanagement   |
| 3       | Level-1-Prüfung         | Vergleich mit Kundendaten (Geburtsdatum, Adresse, Land). Eindeutige False Positives schliessen mit Begründung.                   | Level-1-Analyst           | Fallmanagement   |
| 4       | Level-2-Entscheid       | Unklare Fälle: Zusatzinformationen beim Kunden oder bei der Gegenbank einholen; Entscheid Freigabe oder Blockierung.             | Level-2-Compliance        | Fallmanagement   |
| 5       | True Match              | Vermögenswerte sperren, Meldung an SECO bzw. zuständige Stelle, keine Information an Kunde über Meldung (Tipping-off vermeiden). | Geldwäschereibeauftragter | Fallmanagement   |
| 6       | Dokumentation           | Begründung, Belege und Entscheid revisionssicher ablegen.                                                                        | Compliance                | Fallmanagement   |

# 5. Fristen, Cut-off-Zeiten und Kennzahlen

- Level-1-Bearbeitung: innert 2 Stunden während Bürozeiten.

- Instant Payments: Treffer verhindern Instant-Ausführung; Abklärung im Normalprozess.

- Listenaktualisierung: tägliche, bei Eilmeldungen sofortige Aktualisierung.

# 6. Kontrollen und Compliance

- Vier-Augen-Prinzip bei Freigabe von Level-2-Fällen.

- Monatliche Qualitätsstichprobe geschlossener Fälle.

- Jährliche Überprüfung der Screening-Regeln und Schwellenwerte.

# 7. Ausnahmen und Eskalation

- True Match: sofort Leitung Compliance und Geldwäschereibeauftragter.

- Rückstau \> 50 offene Fälle: Unterstützung aus Level-2 und Information an PayOps.

# 8. Häufige Fragen (FAQ)

**Frage: Warum ist meine Zahlung angehalten?**

Antwort: Zahlungen werden gesetzlich vorgeschrieben gegen Sanktionslisten geprüft. Bei Ähnlichkeiten braucht es eine kurze manuelle Prüfung. Der Kundenservice gibt keine Details zu Listentreffern bekannt.

**Frage: Was mache ich als Berater bei Kundenfragen?**

Antwort: Auf laufende Prüfung verweisen, keine Spekulationen. Bei Bedarf Compliance kontaktieren, nie Details zu Treffern weitergeben.

# 9. Ansprechstellen

Compliance Sanktionen intern 4700, sanctions@gletscherbank.example
