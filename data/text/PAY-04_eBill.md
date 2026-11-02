Gletscherbank AG · Wissensdatenbank Zahlungsverkehr

PAY-04 eBill: Anmeldung, Rechnungsfreigabe und eBill Direct Debit

|                     |                                                                                                          |
|---------------------|----------------------------------------------------------------------------------------------------------|
| **Prozess-ID**      | PAY-04                                                                                                   |
| **Prozesseigner**   | Digital Banking                                                                                          |
| **Systeme**         | E-Banking, eBill-Portal (SIX), PayHub                                                                    |
| **Version / Stand** | 1.0 / 30.10.2026                                                                                         |
| **Klassifikation**  | Intern                                                                                                   |
| **Hinweis**         | Fiktive Musterbank für die CAS-Projektarbeit (ZHAW). Interne Zeiten, Limiten und Kontakte sind erfunden. |

# 1. Zweck und Geltungsbereich

Dieser Prozess beschreibt, wie Privatkunden eBill im E-Banking aktivieren, Rechnungen digital empfangen, freigeben oder ablehnen und eBill Direct Debit nutzen. eBill Direct Debit wurde 2025 von SIX eingeführt und ist ein Nachfolgeweg für das Lastschriftverfahren LSV+/BDD (siehe PAY-07).

# 2. Begriffe

| **Begriff**        | **Erklärung**                                                                     |
|--------------------|-----------------------------------------------------------------------------------|
| eBill              | Digitale Rechnung, die direkt ins E-Banking des Zahlers geliefert wird.           |
| Rechnungssteller   | Unternehmen, das Rechnungen über eBill versendet.                                 |
| Dauerfreigabe      | Automatische Freigabe von Rechnungen eines Rechnungsstellers bis zu einem Betrag. |
| eBill Direct Debit | Digitale Lastschrift auf Basis von eBill, mit Zustimmung des Zahlers.             |

# 3. Rollen und Verantwortlichkeiten

| **Rolle**       | **Aufgabe**                                              |
|-----------------|----------------------------------------------------------|
| Kunde           | Aktiviert eBill, gibt Rechnungen frei oder lehnt sie ab. |
| Digital Banking | Betreibt die Integration ins E-Banking.                  |
| Kundenservice   | Unterstützt bei Anmeldung und Fragen.                    |

# 4. Prozessablauf

| **Nr.** | **Schritt**                  | **Beschreibung**                                                                                               | **Verantwortlich** | **System**   |
|---------|------------------------------|----------------------------------------------------------------------------------------------------------------|--------------------|--------------|
| 1       | eBill aktivieren             | Kunde aktiviert eBill im E-Banking und bestätigt E-Mail-Adresse.                                               | Kunde              | E-Banking    |
| 2       | Rechnungssteller abonnieren  | Kunde sucht Rechnungssteller und meldet sich an oder akzeptiert eine Anmeldeanfrage.                           | Kunde              | eBill-Portal |
| 3       | Rechnung empfangen           | Rechnung erscheint im E-Banking; Mitteilung per App oder E-Mail.                                               | System             | eBill-Portal |
| 4       | Prüfen und freigeben         | Kunde prüft Rechnung (PDF), wählt Zahlungsdatum und gibt frei oder lehnt ab.                                   | Kunde              | E-Banking    |
| 5       | Zahlung ausführen            | Freigegebene Rechnung wird als Zahlung am gewählten Datum ausgeführt (PAY-01).                                 | System             | PayHub       |
| 6       | Dauerfreigabe / Direct Debit | Optional: Kunde erteilt Dauerfreigabe mit Betragslimite; Rechnungen bis zur Limite werden automatisch bezahlt. | Kunde              | eBill-Portal |

# 5. Fristen, Cut-off-Zeiten und Kennzahlen

- Freigegebene Rechnungen werden am gewählten Datum ausgeführt; Cut-off gemäss PAY-01.

- Abgelehnte Rechnungen: Rechnungssteller wird automatisch informiert.

# 6. Kontrollen und Compliance

- Dauerfreigaben sind jederzeit vom Kunden widerrufbar.

- Kunde sieht vor jeder automatischen Zahlung die Rechnung im E-Banking.

- Betragsgrenzen für Dauerfreigaben verhindern unerwartet hohe Belastungen.

# 7. Ausnahmen und Eskalation

- Kunde bestreitet eine Rechnung: Klärung direkt mit dem Rechnungssteller; Bank ist nicht Vertragspartei.

- Technische Störung eBill-Portal: Incident an Digital Banking, Kunden-Banner.

# 8. Häufige Fragen (FAQ)

**Frage: Ich habe meine Rechnung nicht erhalten. Was tun?**

Antwort: Prüfen, ob die Anmeldung beim Rechnungssteller bestätigt ist. Sonst beim Rechnungssteller nachfragen.

**Frage: Was passiert mit meinem LSV nach 2028?**

Antwort: SIX stellt LSV+/BDD per 30. September 2028 ein. eBill mit Dauerfreigabe oder eBill Direct Debit ist eine digitale Alternative.

# 9. Ansprechstellen

Digital Banking Support intern 4600; Kundenservice 0800 000 000 (fiktiv)

# 10. Externe Referenzen

- [KMU-Portal: Einstellung LSV+/BDD per 30.09.2028](https://www.kmu.admin.ch/kmu/en/home/new/news/2026/einstellung-lsv-per-30-09-2028.html)
