Gletscherbank AG · Wissensdatenbank Zahlungsverkehr

PAY-10 Betrugsverdacht im Zahlungsverkehr (Fraud-Fall)

|                     |                                                                                                          |
|---------------------|----------------------------------------------------------------------------------------------------------|
| **Prozess-ID**      | PAY-10                                                                                                   |
| **Prozesseigner**   | Fraud Desk                                                                                               |
| **Systeme**         | Fraud-Monitoring, PayHub, Kundenservice-CRM, Fallmanagement                                              |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                         |
| **Klassifikation**  | Intern                                                                                                   |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Interne Zeiten, Limiten und Kontakte sind erfunden. |

# 1. Zweck und Geltungsbereich

Dieser Prozess regelt die Erkennung und Bearbeitung von Betrugsfällen im Zahlungsverkehr, z. B. Phishing, Social Engineering (falscher Bankmitarbeiter, CEO-Fraud), Anlagebetrug und Kontoübernahme. Ziel ist, Schaden schnell zu begrenzen und Kunden zu unterstützen.

# 2. Begriffe

| **Begriff**          | **Erklärung**                                                          |
|----------------------|------------------------------------------------------------------------|
| Autorisierter Betrug | Kunde gibt die Zahlung selbst frei, wurde aber getäuscht.              |
| Kontoübernahme       | Betrüger nutzt gestohlene Zugangsdaten.                                |
| CEO-Fraud            | Betrüger gibt sich als Vorgesetzte aus und verlangt dringende Zahlung. |
| Money Mule           | Kontoinhaber, der Gelder aus Betrug weiterleitet.                      |

# 3. Rollen und Verantwortlichkeiten

| **Rolle**         | **Aufgabe**                             |
|-------------------|-----------------------------------------|
| Kunde             | Meldet Verdacht so schnell wie möglich. |
| Fraud Desk (24/7) | Sperrt, ruft zurück, koordiniert.       |
| Kundenservice     | Erste Anlaufstelle, Sofortmassnahmen.   |
| Compliance / GwG  | Prüft Meldepflicht bei Money Mules.     |

# 4. Prozessablauf

| **Nr.** | **Schritt**              | **Beschreibung**                                                                                              | **Verantwortlich**      | **System**          |
|---------|--------------------------|---------------------------------------------------------------------------------------------------------------|-------------------------|---------------------|
| 1       | Erkennung                | Alarm aus Fraud-Monitoring (ungewöhnlicher Betrag, neuer Empfänger, neues Gerät) oder Kundenmeldung.          | System / Kunde          | Fraud-Monitoring    |
| 2       | Sofortmassnahmen         | Offene Zahlungen stoppen, E-Banking-Zugang sperren, Karten sperren falls betroffen.                           | Fraud Desk              | PayHub / E-Banking  |
| 3       | Rückruf                  | Bereits ausgeführte Zahlungen sofort mit Grund «Betrug» zurückrufen (PAY-09); Empfängerbank um Sperre bitten. | Fraud Desk              | Investigation-Modul |
| 4       | Kunde unterstützen       | Ablauf erklären, Anzeige bei der Polizei empfehlen, neue Zugangsdaten einrichten.                             | Kundenservice           | CRM                 |
| 5       | Eingehende Betrugsgelder | Erhält ein Gletscherbank-Konto Betrugsgelder: Betrag sperren, Prüfung Money Mule, Compliance einbeziehen.     | Fraud Desk / Compliance | Fallmanagement      |
| 6       | Abschluss und Lernen     | Fall dokumentieren, Regeln im Fraud-Monitoring anpassen, Muster an Prävention melden.                         | Fraud Desk              | Fallmanagement      |

# 5. Fristen, Cut-off-Zeiten und Kennzahlen

- Sofortmassnahmen: innert 15 Minuten nach Meldung, rund um die Uhr.

- Rückruf bei Betrug: innert 1 Stunde nach Bestätigung des Verdachts.

- Je früher die Meldung, desto höher die Chance, Geld zu sichern.

# 6. Kontrollen und Compliance

- Bank fragt nie per Telefon, SMS oder E-Mail nach Passwörtern oder Freigabecodes; diese Botschaft ist Teil jeder Kundenkommunikation.

- Zusätzliche Bestätigung bei Zahlungen an neue Empfänger über Schwellenwert.

- Monatliches Fraud-Reporting an Geschäftsleitung (Fälle, Schaden, gesicherte Beträge).

# 7. Ausnahmen und Eskalation

- Grosser Schaden (\> CHF 50'000) oder viele gleichartige Fälle: Leitung Fraud Desk, Kommunikation und Geschäftsleitung informieren.

- Verdacht auf interne Beteiligung: Compliance und Leitung Sicherheit.

# 8. Häufige Fragen (FAQ)

**Frage: Ich habe meine Zugangsdaten am Telefon angegeben. Was jetzt?**

Antwort: Sofort Fraud Desk anrufen (24/7). Der Zugang wird gesperrt und offene Zahlungen gestoppt.

**Frage: Erstattet die Bank den Schaden?**

Antwort: Das hängt vom Einzelfall und den Vertragsbedingungen ab. Bei selbst freigegebenen Zahlungen trägt in der Regel der Kunde den Schaden; die Bank versucht, Gelder zurückzuholen.

# 9. Ansprechstellen

Fraud Desk 24/7 intern 4499, extern 0800 111 111 (fiktiv)
