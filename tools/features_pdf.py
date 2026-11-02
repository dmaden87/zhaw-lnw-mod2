"""Kurze Feature-Übersicht der Web-App als PDF (A4 hoch).  Aufruf: python3 tools/features_pdf.py"""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "pdf" / "feature-uebersicht.pdf"

FEATURES = [
    ("Briefing", "#2f5bea", [
        "Frage stellen, drei Detailstufen parallel: <b>Instant</b> (5–10 Sek. Lesezeit), <b>Basic</b> (≤ 3 Min.), <b>Full</b> (≤ 15 Min.); Umschalten ohne Wartezeit",
        "<b>Konfidenz-Ampel</b> Grün / Gelb / Rot mit Begründung",
        "<b>Quellen</b> mit Owner und Stand, öffnen das Dokument im neuen Tab beim zitierten Kapitel",
        "Nie eine Sackgasse: bei Gelb/Rot «Meinst du vielleicht …?» und Ansprechstelle",
        "Widersprüche zwischen Quellen werden angezeigt (Protokoll vor Transkript)",
        "Verlauf löschen · Beispielfragen · Handy-Ansicht",
    ]),
    ("Wissensbasis", "#18a058", [
        "60 Dokumente der fiktiven Gletscherbank, 498 Abschnitte, kombinierte Suche (Bedeutung + Stichworte)",
        "Liste mit Kategorie, Owner, Stand; Dokumente lesen im Browser",
        "<b>Hochladen</b> von Word, PDF, Markdown, Text (max. 4 MB) – sofort durchsuchbar",
        "<b>Ersetzen</b> einer neuen Fassung, <b>aktivieren / inaktivieren</b> statt löschen",
        "Alles-oder-nichts-Speicherung und verständliche Fehlermeldungen",
    ]),
    ("Testing- und Adjustment-Modus", "#e3a008", [
        "Antworten bewerten: richtig / teilweise / falsch, mit Kommentar",
        "Fehlendes Wissen direkt ergänzen (wird als KOR-Dokument durchsuchbar)",
        "Bewertungen kalibrieren die Ampel für ähnliche Fragen",
        "Zähler im Modus, Export aller Bewertungen als CSV",
    ]),
    ("Schutzmechanismen", "#c2410c", [
        "Abwehr von Manipulationsversuchen und Fragen nach dem Systemprompt – ohne KI-Aufruf",
        "Kein Code, keine Urteile über Personen oder Entscheide, keine Rechts- oder Anlageberatung",
        "Personendaten (IBAN, Kartennummer, AHV, E-Mail) werden geschwärzt",
        "Zahlenprüfung gegen die Quellen, Code-Filter, Schutz des Systemprompts",
        "Uploads mit versteckten Anweisungen an die KI werden abgewiesen · max. 30 Fragen / 10 Min.",
    ]),
    ("Benutzer und Einstellungen", "#7c3aed", [
        "Login mit Benutzername und Passwort (Sitzung 12 Std.)",
        "Benutzer anlegen, Rolle ändern, sperren, Passwort zurücksetzen (Admin)",
        "Schalter <b>«Allgemeinwissen Payments und Banking»</b>: an = gekennzeichnet und immer Gelb; aus = nur Wissensbasis",
        "Zähler der Schutzmechanismen (heute, 7 Tage, total) – ohne Fragetexte",
    ]),
    ("Qualität und Betrieb", "#0e7490", [
        "137 automatisierte Unit- und API-Tests bei jedem Push",
        "Live-Regression mit 24 Referenz- und Sicherheitsfragen, werktags automatisch",
        "Automatisches Deployment bei jedem Push (Vercel), Nutzungsstatistik (Vercel Analytics)",
        "Modelle per Einstellung austauschbar, Ausweichmodell bei Überlast",
    ]),
]

ROLES = [
    ("Fragen, Quellen, Dokumente lesen", 1),
    ("Dokumente verwalten", 2),
    ("Testing-Modus", 3),
    ("Benutzer, Einstellungen", 4),
]

def cards():
    out = ""
    for title, color, items in FEATURES:
        lis = "".join(f"<li>{i}</li>" for i in items)
        out += f'<section class="card" style="--c:{color}"><h2>{title}</h2><ul>{lis}</ul></section>'
    return out

def roles():
    head = "<tr><th>Darf …</th><th>User</th><th>Super-U.</th><th>KI-PM</th><th>Admin</th></tr>"
    rows = "".join("<tr><td>" + t + "</td>" + "".join(f'<td class="ck">{"✓" if r <= lvl else "–"}</td>' for r in (0, 1, 2, 3) for lvl in [r + 1] if False) + "".join(f'<td class="{"y" if need <= r else "n"}">{"✓" if need <= r else "–"}</td>' for r in (1, 2, 3, 4)) + "</tr>" for t, need in ROLES)
    return f"<table>{head}{rows}</table>"

CSS = """
@page { size: A4; margin: 9mm 11mm 8mm; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Inter, sans-serif; color: #1d2433; font-size: 8.3pt; line-height: 1.42; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.head { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2.5px solid #0f2a4a; padding-bottom: 3mm; margin-bottom: 3.2mm; }
.brand { display: flex; gap: 3.5mm; align-items: center; }
.logo { width: 11mm; height: 11mm; border-radius: 2.5mm; background: #0f2a4a; display: grid; place-items: center; }
.kicker { font-size: 7pt; letter-spacing: .12em; text-transform: uppercase; color: #5b6b82; font-weight: 600; }
h1 { font-family: 'Inter Display', Inter, sans-serif; font-size: 20pt; margin: 0; color: #0f2a4a; letter-spacing: -.01em; }
.sub { color: #5b6b82; font-size: 8.6pt; }
.meta { text-align: right; font-size: 7.6pt; color: #5b6b82; line-height: 1.5; } .meta b { color: #0f2a4a; }
.intro { background: #0f2a4a; color: #fff; border-radius: 2.5mm; padding: 2.6mm 4mm; margin-bottom: 3.2mm; font-size: 8.3pt; line-height: 1.5; }
.intro b { color: #ffd166; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.8mm; }
.card { background: #f6f8fb; border: 1px solid #dde3ec; border-top: 3px solid var(--c); border-radius: 2mm; padding: 2.8mm 3.4mm 2.2mm; }
.card h2 { margin: 0 0 1.5mm; font-size: 10pt; color: #0f2a4a; display: flex; align-items: center; gap: 2mm; }
.card h2::before { content: ""; width: 2.4mm; height: 2.4mm; border-radius: 50%; background: var(--c); }
ul { margin: 0; padding-left: 3.8mm; } li { margin-bottom: .9mm; } li::marker { color: #8a99ad; } b { color: #0f2a4a; }
.bottom { display: grid; grid-template-columns: 1.2fr 1fr; gap: 2.8mm; margin-top: 2.8mm; }
.box { background: #f6f8fb; border: 1px solid #dde3ec; border-radius: 2mm; padding: 2.2mm 3.2mm; }
.box h2 { margin: 0 0 1.8mm; font-size: 10pt; color: #0f2a4a; }
table { width: 100%; border-collapse: collapse; font-size: 7.8pt; }
th, td { padding: .7mm 1.2mm; border-bottom: 1px solid #dde3ec; text-align: center; } th:first-child, td:first-child { text-align: left; }
th { color: #5b6b82; font-weight: 600; font-size: 7.2pt; }
td.y { color: #18a058; font-weight: 700; } td.n { color: #b8c2d0; }
.tech { display: grid; grid-template-columns: auto 1fr; gap: .9mm 3mm; font-size: 7.8pt; } .tech span:nth-child(odd) { color: #5b6b82; font-weight: 600; }
.foot { margin-top: 2.5mm; display: flex; justify-content: space-between; font-size: 6.8pt; color: #8a99ad; border-top: 1px solid #dde3ec; padding-top: 2mm; }
"""

LOGO = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20l6-11 4 6 2-3 6 8z"/><path d="M7.5 12.5l1.5 1.5 1.5-1.5"/></svg>'

doc = f"""<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="head"><div class="brand"><div class="logo">{LOGO}</div><div>
<div class="kicker">Gletscherbank AG (fiktiv) · CAS ZHAW Modul 2 · LNW 2</div>
<h1>Briefing-Bot – Features der Web-App</h1>
<div class="sub">Beta v0.5 · zhaw-lnw-mod2.vercel.app</div></div></div>
<div class="meta"><b>Team</b> Peri · JJ · Deniz<br><b>Stand</b> 02.11.2026</div></div>
<div class="intro">Der Briefing-Bot liefert vor, während und nach Meetings <b>kompaktes, quellenbasiertes Wissen</b> zu Prozessen, Schnittstellen und Fachthemen des Zahlungsverkehrs. Jede Antwort kommt mit Quellen und Konfidenz-Ampel und endet <b>nie in einer Sackgasse</b>.</div>
<div class="grid">{cards()}</div>
<div class="bottom">
<div class="box"><h2>Rollen</h2>{roles()}</div>
<div class="box"><h2>Technik</h2><div class="tech">
<span>Web-App</span><span>Next.js auf Vercel, Code auf GitHub</span>
<span>Datenbank</span><span>Neon PostgreSQL + pgvector (EU)</span>
<span>KI</span><span>Google Gemini: Embedding 2, 3.5 Flash Lite / Flash</span>
<span>Methode</span><span>RAG mit kombinierter Suche und Konfidenz-Ampel</span>
<span>Entwicklung</span><span>mit Claude (Anthropic), Modell Claude Opus 5.5</span>
</div></div></div>
<div class="foot"><span>Fiktive Musterbank für die CAS-Projektarbeit · alle Namen, Zahlen und Systeme erfunden</span><span>Details: docs/loesungsdokumentation.md · docs/testkonzept.md</span></div>
</body></html>"""

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pg.set_content(doc, wait_until="networkidle")
    pg.pdf(path=str(OUT), prefer_css_page_size=True, print_background=True)
    b.close()
print("PDF:", OUT.relative_to(ROOT))
