"""Erzeugt PDF-Versionen der Unterlagen in docs/pdf/.

Aufruf im Repository-Root:  python3 tools/build_pdfs.py
Benötigt: pandoc, Python-Paket playwright mit Chromium.
Mermaid-Diagramme werden durch das vorgerenderte Bild docs/architektur.png ersetzt.
"""
import re
import subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
OUT = DOCS / "pdf"
FILES = ["loesungsdokumentation.md", "journal.md", "modellwahl.md", "AI-Canvas.md"]

CSS = """
@page { size: A4; margin: 18mm 16mm 20mm 16mm; }
body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; line-height: 1.45; color: #1d2433; }
h1 { font-size: 18pt; margin: 0 0 6pt; color: #1d2433; }
h2 { font-size: 13pt; margin: 16pt 0 6pt; padding-bottom: 3pt; border-bottom: 1px solid #dfe3ea; break-after: avoid; }
h3 { font-size: 11pt; margin: 12pt 0 4pt; break-after: avoid; }
table { border-collapse: collapse; width: 100%; margin: 6pt 0 10pt; font-size: 9pt; break-inside: auto; }
th, td { border: 1px solid #dfe3ea; padding: 4pt 6pt; text-align: left; vertical-align: top; }
th { background: #f1f3f7; }
tr { break-inside: avoid; }
code { font-family: Consolas, monospace; font-size: 8.5pt; background: #f4f5f7; padding: 0 2pt; }
pre { background: #f4f5f7; padding: 6pt; font-size: 8pt; white-space: pre-wrap; }
img { max-width: 100%; }
a { color: #2f5bea; text-decoration: none; }
hr { border: 0; border-top: 1px solid #dfe3ea; }
"""


def html_for(md_path: Path) -> str:
    md = md_path.read_text(encoding="utf-8")
    md = re.sub(r"```mermaid\n.*?```", "![Architektur](../architektur.png)", md, flags=re.S)
    body = subprocess.run(["pandoc", "-f", "gfm", "-t", "html5"], input=md, capture_output=True, text=True, check=True).stdout
    body = body.replace('src="../architektur.png"', f'src="file://{DOCS / "architektur.png"}"')
    return f"<!DOCTYPE html><html lang='de'><head><meta charset='utf-8'><style>{CSS}</style></head><body>{body}</body></html>"


def main():
    OUT.mkdir(exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        for name in FILES:
            src = DOCS / name
            tmp = OUT / (src.stem + ".tmp.html")
            tmp.write_text(html_for(src), encoding="utf-8")
            page.goto(f"file://{tmp}")
            page.pdf(
                path=str(OUT / f"{src.stem}.pdf"), format="A4", print_background=True,
                display_header_footer=True,
                header_template="<div></div>",
                footer_template="<div style='font-size:8px;color:#6b7385;width:100%;padding:0 16mm;display:flex;justify-content:space-between'>"
                                f"<span>Briefing-Bot · LNW 2 CAS ZHAW · {src.stem}</span>"
                                "<span><span class='pageNumber'></span> / <span class='totalPages'></span></span></div>",
                margin={"top": "18mm", "bottom": "20mm", "left": "16mm", "right": "16mm"},
            )
            tmp.unlink()
            print("PDF:", (OUT / f"{src.stem}.pdf").relative_to(ROOT))
        browser.close()


if __name__ == "__main__":
    main()
