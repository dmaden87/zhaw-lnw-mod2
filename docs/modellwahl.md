# Modellwahl (Schritt 2)

**Stand:** 02.11.2026 · **Verantwortlich:** Deniz (Tech Lead) · **Anbieter:** Google Gemini API, Gratis-Stufe

## Entscheid

| Aufgabe | Modell | Begründung |
| --- | --- | --- |
| Embedding (Suche) | `gemini-embedding-2` | Allgemein verfügbar (nicht Preview), mehrsprachig, bis 8'192 Tokens pro Abschnitt; Vektoren mit 768 Dimensionen (kompakt, gut für pgvector) |
| Antwort Instant und Basic | `gemini-3.5-flash-lite` | Antwortzeit im Test 0,7 s – erfüllt das Ziel «Instant < 5 s» im Meeting |
| Antwort Full | `gemini-3.5-flash` (Thinking minimal) | Etwas stärker für längere Zusammenfassungen, im Test 1,2 s |
| Ausweichmodell | `gemini-flash-lite-latest` | Falls ein Modell überlastet ist (Fehler 503) |

Alle Modellnamen sind als Umgebungsvariablen konfigurierbar; ein Wechsel braucht keine Codeänderung.

## Testlauf vom 02.11.2026

Getestet über `/api/admin/probe` mit dem Projektschlüssel (Gratis-Stufe), Frage: «Was ist ein Instant Payment?»

| Modell | Ergebnis | Antwortzeit |
| --- | --- | --- |
| gemini-embedding-2 | OK, 768 Dimensionen | 0,3 s |
| gemini-embedding-001 | OK, 768 Dimensionen | 0,3 s |
| gemini-3.8-flash (Standard) | OK, korrekt | **85 s** – für Live-Einsatz untauglich |
| gemini-3.5-flash (Thinking minimal) | OK, korrekt | 1,2 s |
| gemini-3.5-flash-lite | OK, korrekt | 0,7 s |
| gemini-flash-lite-latest | OK, korrekt | 0,8 s |
| gemini-3.1-flash-lite | Fehler 503 (Überlast) | – |
| gemini-2.5-flash | Fehler 404 (für neue Nutzer nicht mehr verfügbar) | – |

## Erkenntnisse für Präsentation und Diskussion

- **Neuestes Modell ≠ bestes Modell für den Zweck:** Das neueste Flash-Modell lieferte gute Qualität, aber 85 s Wartezeit. Für Instant im Meeting zählt Geschwindigkeit.
- **Modelle verschwinden:** Ein ein Jahr altes Modell (2.5 Flash) ist bereits abgekündigt. Deshalb konfigurierbare Modellnamen und ein Ausweichmodell.
- **Gratis-Stufe:** Eingaben dürfen von Google zur Produktverbesserung genutzt werden. Zulässig, weil ausschliesslich fiktive Daten; für den Pilot ist ein bezahlter Zugang mit Datenschutz-Zusicherung vorgesehen (siehe Risiken im AI-Canvas).
