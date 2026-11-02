"""Gestaltetes PDF des AI-Canvas (A4 quer): Seite 1 Canvas-Übersicht, danach alle Felder im Detail.

Aufruf im Repository-Root:  python3 tools/canvas_pdf.py
Quelle: docs/AI-Canvas.md (Detailseiten) und die Kurzfassung unten (Übersichtsseite).
"""
import re, subprocess, html
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
MD = (ROOT / "docs" / "AI-Canvas.md").read_text(encoding="utf-8")
OUT = ROOT / "docs" / "pdf" / "AI-Canvas.pdf"

version = re.search(r"Version ([\d.]+) · Stand ([\d.]+)", MD)
VERSION, STAND = version.group(1), version.group(2)

# Kurzfassung für die Übersichtsseite (je Feld 3–5 Punkte, aus docs/AI-Canvas.md verdichtet)
SUMMARY = {
    1: ["Basiswissen fehlt im Moment: fachlich, technisch, prozessual",
        "Wissen verteilt auf Mail, Intranet, SharePoint, Confluence",
        "Nach 30–45-Min.-Meeting: 1 Person recherchiert 1–2 Std.",
        "Neue stärker betroffen als Langjährige"],
    2: ["<b>Instant</b> 5–10 Sek.: 2–3 Kernsätze, sofort mitreden",
        "<b>Basic</b> ≤ 3 Min.: Kernpunkte, Ablauf, Begriffe",
        "<b>Full</b> ≤ 15 Min.: Zusammenhänge, Schnittstellen, Ansprechpersonen",
        "Jede Aussage mit Quelle und Ampel"],
    3: ["Primär: Meeting-Teilnehmende",
        "Neue Mitarbeitende (Onboarding), Führung, Wissens-Owner",
        "IT, Datenschutz, Compliance",
        "Sponsor COO · Entscheid: Geschäftsleitung"],
    4: ["Relevante Stellen finden (kombinierte Suche)",
        "Quellenbasiert zusammenfassen in 3 Stufen",
        "Sicherheit schätzen, Alternativen und Ansprechstelle vorschlagen",
        "Technik: RAG mit LLM"],
    5: ["Falsche Antwort und «nichts gefunden» sind beide fatal",
        "🟢 ≥ 85 % · 🟡 60–84 % · 🔴 < 60 %",
        "Nie eine Sackgasse: Vorschläge + Ansprechstelle",
        "Widerspruch: Protokoll vor Transkript, max. Gelb",
        "Der Mensch entscheidet"],
    6: ["Während: Instant, bei Bedarf Basic",
        "Vorher: Basic/Full · Nachher: Full statt Recherche",
        "Briefings im Team teilen",
        "Zielbild: Windows-App per Tastenkürzel"],
    7: ["Nachrecherche 1–2 Std. → < 15 Min.",
        "Nutzung in ≥ 3 von 5 Meetings",
        "Korrektheit ≥ 80 %, Quellen ≥ 90 %, Halluzination < 5 %",
        "0 % Sackgassen · Instant < 5 Sek."],
    8: ["MVP: Unternehmenswissen inkl. Protokolle, Transkripte",
        "V1: persönliche Mails, Teams, OneDrive",
        "60 fiktive Dokumente der Gletscherbank",
        "Prozesse, Weisungen, Systeme, 3 Schnittstellen"],
    9: ["Kein eigenes Training – vortrainiertes LLM",
        "Chunking → Embeddings → pgvector",
        "Systemprompt mit Grundregeln A–G",
        "Schalter: Allgemeinwissen Payments/Banking"],
    10: ["Testing-Modus: richtig / teilweise / falsch",
         "Ergänzungen als KOR-Dokumente, Ampel kalibriert",
         "Automatische Regression werktäglich",
         "Hinweise an Wissens-Owner"],
    11: ["Halluzination: Quellenpflicht, Zahlenprüfung, Tests",
         "Manipulation: 5 Schutzschichten, Red-Team",
         "Datenschutz: Schwärzung, DSFA, Hosting CH/EU",
         "Sensible Meetings ohne KI (MP-05)",
         "EU AI Act: freiwillig Art. 50 Transparenz"],
    12: ["PoC effektiv ca. CHF 16 (Gemini Prepaid)",
         "Pilot ≈ CHF 41'000 (fiktiv)",
         "Rollout ≈ CHF 52'500 p. a.",
         "Nutzen ≈ CHF 450'000 p. a. → Amortisation < 1 Jahr"],
    13: ["Make: Next.js auf Vercel, Code auf GitHub",
         "Neon Postgres + pgvector, Google Gemini",
         "Rollen User / Super-User / KI-PM / Admin",
         "137 Tests, Live-Regression, Schutzmechanismen",
         "Entwickelt mit Claude Opus 5.5"],
}

ZONES = [
    ("Warum?", "Problem & Nutzen", [1, 2, 3]),
    ("Was macht die KI?", "Prediction → Judgment → Action → Outcome", [4, 5, 6, 7]),
    ("Womit?", "Daten & Lernen", [8, 9, 10]),
    ("Wie?", "Umsetzung", [11, 12, 13]),
]

# Felder aus dem Markdown lesen
fields = {}
for m in re.finditer(r"^### (\d+)\. (.+?)\n(.*?)(?=^### |^## |\Z)", MD, flags=re.S | re.M):
    fields[int(m.group(1))] = (m.group(2).strip(), m.group(3).strip())


def md2html(text):
    text = re.sub(r"^( {4})- ", "  - ", text, flags=re.M)  # verschachtelte Listen
    return subprocess.run(["pandoc", "-f", "gfm", "-t", "html5"], input=text, capture_output=True, text=True, check=True).stdout


def box(n, small=True):
    title = html.escape(fields[n][0])
    items = "".join(f"<li>{t}</li>" for t in SUMMARY[n])
    return f'<div class="box b{n}"><div class="bh"><span class="num">{n}</span>{title}</div><ul>{items}</ul></div>'


overview = "".join(
    f'<section class="zone"><div class="zl"><div class="zt">{z}</div><div class="zs">{s}</div></div>'
    f'<div class="row c{len(ns)}">{"".join(box(n) for n in ns)}</div></section>'
    for z, s, ns in ZONES)

details = ""
for z, s, ns in ZONES + [("Verweise & Notizen", "Repository, Pitch, Meilensteine", [14, 15])]:
    cards = "".join(
        f'<article class="card"><h3><span class="num">{n}</span>{html.escape(fields[n][0])}</h3>{md2html(fields[n][1])}</article>'
        for n in ns)
    details += f'<section class="dz"><h2><span>{z}</span> {s}</h2><div class="cols">{cards}</div></section>'

CSS = """
@page { size: A4 landscape; margin: 10mm 10mm 11mm; }
@page cover { size: A4 landscape; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; font-family: Inter, 'DejaVu Sans', sans-serif; color: #1d2433; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { page: cover; width: 297mm; height: 210mm; padding: 9mm 10mm 8mm; position: relative; page-break-after: always; overflow: hidden; }
.head { display: flex; align-items: flex-end; justify-content: space-between; border-bottom: 2.5px solid #0f2a4a; padding-bottom: 3mm; margin-bottom: 3.5mm; }
.brand { display: flex; align-items: center; gap: 3.5mm; }
.logo { width: 11mm; height: 11mm; border-radius: 2.5mm; background: #0f2a4a; display: grid; place-items: center; }
.kicker { font-size: 7.5pt; letter-spacing: .12em; text-transform: uppercase; color: #5b6b82; font-weight: 600; }
h1 { font-family: 'Inter Display', Inter, sans-serif; font-size: 22pt; margin: 0; letter-spacing: -.01em; color: #0f2a4a; }
.sub { font-size: 9pt; color: #5b6b82; margin-top: .6mm; }
.meta { text-align: right; font-size: 8pt; color: #5b6b82; line-height: 1.5; }
.meta b { color: #0f2a4a; }
.zone { display: grid; grid-template-columns: 24mm 1fr; gap: 2.5mm; margin-bottom: 2.5mm; }
.zl { background: #0f2a4a; color: #fff; border-radius: 2mm; padding: 2.5mm 2.2mm; display: flex; flex-direction: column; justify-content: center; }
.zt { font-weight: 700; font-size: 9.5pt; line-height: 1.15; }
.zs { font-size: 6.4pt; opacity: .75; margin-top: 1.2mm; line-height: 1.3; }
.row { display: grid; gap: 2.5mm; }
.row.c3 { grid-template-columns: repeat(3, 1fr); } .row.c4 { grid-template-columns: repeat(4, 1fr); }
.box { background: #f6f8fb; border: 1px solid #dde3ec; border-radius: 2mm; padding: 2.2mm 2.6mm 2mm; border-top: 3px solid #2f5bea; }
.zone:nth-child(2) .box { border-top-color: #18a058; } .zone:nth-child(3) .box { border-top-color: #e3a008; } .zone:nth-child(4) .box { border-top-color: #c2410c; }
.bh { font-weight: 700; font-size: 9pt; color: #0f2a4a; margin-bottom: 1.2mm; display: flex; align-items: center; gap: 1.6mm; }
.num { display: inline-grid; place-items: center; min-width: 4.6mm; height: 4.6mm; border-radius: 50%; background: #0f2a4a; color: #fff; font-size: 6.6pt; font-weight: 700; flex: none; }
.box ul { margin: 0; padding-left: 3.2mm; font-size: 7.6pt; line-height: 1.42; }
.box li { margin: 0 0 .5mm; } .box li::marker { color: #8a99ad; }
.foot { position: absolute; left: 10mm; right: 10mm; bottom: 4.5mm; display: flex; justify-content: space-between; font-size: 6.6pt; color: #8a99ad; }
/* Detailseiten */
.details { padding: 0; }
.dz { break-before: page; } .dz:first-child { break-before: auto; }
.dz h2 { break-after: avoid; font-size: 13pt; color: #0f2a4a; margin: 0 0 3.5mm; padding-bottom: 2mm; border-bottom: 2px solid #0f2a4a; font-weight: 600; }
.dz h2 span { font-weight: 800; }
.cols { column-count: 2; column-gap: 6mm; }
.card { background: #f6f8fb; border: 1px solid #dde3ec; border-radius: 2mm; padding: 3mm 4mm; margin: 0 0 4mm; font-size: 8.4pt; line-height: 1.45; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
.card h3 { break-after: avoid; }
.card li, .card p { break-inside: avoid; }
.card h3 { margin: 0 0 2mm; font-size: 10pt; color: #0f2a4a; display: flex; align-items: center; gap: 2mm; }
.card p { margin: 0 0 2mm; } .card ul, .card ol { margin: 0 0 2mm; padding-left: 4.5mm; } .card li { margin-bottom: .6mm; }
.card li::marker { color: #8a99ad; } .card strong { color: #0f2a4a; }
.card code { font-family: 'DejaVu Sans Mono', monospace; font-size: 7.4pt; background: #e9edf3; padding: 0 1mm; border-radius: 1mm; }
"""

LOGO = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20l6-11 4 6 2-3 6 8z"/><path d="M7.5 12.5l1.5 1.5 1.5-1.5"/></svg>'
HEAD = f'''<div class="head"><div class="brand"><div class="logo">{LOGO}</div><div>
<div class="kicker">Gletscherbank AG (fiktiv) · CAS ZHAW Modul 2 · LNW 2</div>
<h1>AI-Canvas – Briefing-Bot</h1>
<div class="sub">Kompaktes, quellenbasiertes Wissen zu Prozessen, Schnittstellen und Fachthemen – vor, während und nach Meetings</div></div></div>
<div class="meta"><b>Team</b> Peri · JJ · Deniz<br><b>Version</b> {VERSION} · Stand {STAND}<br>zhaw-lnw-mod2.vercel.app</div></div>'''

doc = f"""<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="page">{HEAD}{overview}
<div class="foot"><span>Fiktive Musterbank für die CAS-Projektarbeit · alle Namen, Zahlen und Systeme erfunden</span><span>Details zu jedem Feld auf den folgenden Seiten · Quelle: docs/AI-Canvas.md</span></div></div>
<div class="details">{details}</div>
</body></html>"""

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.set_content(doc, wait_until="networkidle")
    pg.pdf(path=str(OUT), prefer_css_page_size=True, print_background=True)
    b.close()
print("PDF:", OUT.relative_to(ROOT))
