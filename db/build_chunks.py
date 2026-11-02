"""Bereitet die Wissensdatenbank für den Import vor.

1. Wandelt jedes Dokument aus data/Wissensdatenbank_Payment in Markdown um (data/text/<ID>.md)
2. Liest die Metadaten aus dem Kopf (Owner, Version/Stand, Klassifikation)
3. Teilt die Dokumente entlang der Kapitel in Abschnitte (Chunks) von max. ca. 1'500 Zeichen
4. Schreibt alles nach app/data/chunks.json – diese Datei liest der Import-Endpunkt

Aufruf (im Repository-Root):  python3 db/build_chunks.py
Benötigt: pandoc
"""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "Wissensdatenbank_Payment"
TEXT_OUT = ROOT / "data" / "text"
JSON_OUT = ROOT / "app" / "data" / "chunks.json"
DOCS_OUT = ROOT / "app" / "data" / "documents.json"  # Volltexte für die Dokumentansicht in der App
MAX_CHARS = 1500

CATEGORY = {
    "PAY": "Prozess", "AA": "Arbeitsanweisung", "LF": "Leitfaden", "WE": "Weisung",
    "KX": "Verhaltenskodex", "PB": "Produktblatt", "ORG": "Organisation", "GL": "Glossar",
    "SH": "Systemhandbuch", "MP": "Meeting-Protokoll", "TR": "Meeting-Transkript",
    "COM": "Compliance-Prozess", "RISK": "Risk-Prozess", "EW": "Meldewege", "IF": "Schnittstelle",
}
OWNER_KEYS = ["Prozesseigner", "Verantwortlich", "Owner fachlich", "System-Owner", "Leitung", "Owner"]


def to_markdown(path: Path) -> str:
    return subprocess.run(
        ["pandoc", str(path), "-t", "gfm", "--wrap=none"],
        check=True, capture_output=True, text=True,
    ).stdout


def parse_meta(md: str) -> dict:
    meta, started = {}, False
    for line in md.splitlines():
        if started and not line.startswith("|"):
            break  # nur die erste Tabelle (Dokumentkopf) auswerten
        started = started or line.startswith("|")
        m = re.match(r"^\|\s*\*\*(.+?)\*\*\s*\|\s*(.*?)\s*\|\s*$", line)
        if m:
            meta[m.group(1).strip()] = re.sub(r"\s+", " ", m.group(2)).strip()
    return meta


def split_blocks(text: str) -> list[str]:
    return [b.strip() for b in re.split(r"\n\s*\n", text) if b.strip()]


def split_table(block: str) -> list[str]:
    lines = block.splitlines()
    if len(lines) < 3 or len(block) <= MAX_CHARS:
        return [block]
    header, rows, parts, cur = lines[:2], lines[2:], [], []
    for row in rows:
        if cur and len("\n".join(header + cur + [row])) > MAX_CHARS:
            parts.append("\n".join(header + cur))
            cur = []
        cur.append(row)
    if cur:
        parts.append("\n".join(header + cur))
    return parts


def chunk_section(content: str) -> list[str]:
    pieces = []
    for block in split_blocks(content):
        pieces.extend(split_table(block) if block.startswith("|") else [block])
    chunks, cur = [], ""
    for p in pieces:
        if cur and len(cur) + len(p) + 2 > MAX_CHARS:
            chunks.append(cur)
            cur = p
        else:
            cur = f"{cur}\n\n{p}" if cur else p
    if cur:
        chunks.append(cur)
    return chunks


def process_docx(path: Path, documents: list, chunks: list):
    md = to_markdown(path)
    doc_id = path.stem.split("_")[0]
    lines = md.splitlines()
    title = next((l.strip() for l in lines[1:] if l.strip() and not l.startswith("|")), path.stem)
    meta = parse_meta(md)
    owner = next((meta[k] for k in OWNER_KEYS if k in meta), "")
    prefix = re.match(r"[A-Z]+", doc_id).group(0)

    documents.append({
        "id": doc_id, "title": title, "category": CATEGORY.get(prefix, prefix),
        "owner": owner, "version": meta.get("Version / Stand", ""),
        "classification": meta.get("Klassifikation", ""),
        "path": str(path.relative_to(ROOT)),
    })
    (TEXT_OUT / f"{path.stem}.md").write_text(md, encoding="utf-8")
    documents[-1]["markdown"] = md

    # Kopf (Titelzeilen + Metatabelle) überspringen, dann nach Kapiteln (# ...) teilen
    body = md.split("\n# ", 1)
    head_rest = body[0]
    sections = [("Übersicht", head_rest.split("\n\n", 2)[-1] if len(body) == 1 else "")]
    if len(body) > 1:
        for sec in ("# " + body[1]).split("\n# "):
            sec = sec.lstrip("# ").strip()
            heading, _, content = sec.partition("\n")
            sections.append((heading.strip(), content.strip()))
    for heading, content in sections:
        if not content:
            continue
        for i, text in enumerate(chunk_section(content)):
            chunks.append({"doc_id": doc_id, "section": heading, "part": i + 1, "content": text})


def process_yaml(path: Path, documents: list, chunks: list):
    raw = path.read_text(encoding="utf-8")
    doc_id = path.stem.split("_")[0]
    documents.append({
        "id": doc_id, "title": f"{doc_id} PayHub Payment Initiation API (OpenAPI)",
        "category": "Schnittstelle", "owner": "IT Payments (technisch), Digital Banking (fachlich)",
        "version": "1.2.0 / 30.10.2026", "classification": "Intern",
        "path": str(path.relative_to(ROOT)),
    })
    (TEXT_OUT / f"{path.stem}.md").write_text(f"```yaml\n{raw}\n```\n", encoding="utf-8")
    documents[-1]["markdown"] = f"```yaml\n{raw}\n```\n"
    # Teilen an Endpunkten (  /pfad:) und Schemas (    Name:)
    parts = re.split(r"\n(?=  /[^\n]+:\n|    [A-Z][A-Za-z]+:\n)", raw)
    for part in parts:
        first = part.strip().splitlines()[0].strip().rstrip(":")
        heading = "Allgemein" if first.startswith("openapi") else first
        for i, text in enumerate(chunk_section(part.strip())):
            chunks.append({"doc_id": doc_id, "section": heading, "part": i + 1, "content": text})


def main():
    TEXT_OUT.mkdir(parents=True, exist_ok=True)
    JSON_OUT.parent.mkdir(parents=True, exist_ok=True)
    documents, chunks = [], []
    for path in sorted(SRC.rglob("*")):
        if path.suffix == ".docx":
            process_docx(path, documents, chunks)
        elif path.suffix in (".yaml", ".yml"):
            process_yaml(path, documents, chunks)
    titles = {d["id"]: d["title"] for d in documents}
    for n, c in enumerate(chunks, 1):
        c["id"] = n
        c["embed_text"] = f"{titles[c['doc_id']]}\nAbschnitt: {c['section']}\n\n{c['content']}"
    DOCS_OUT.write_text(json.dumps({d["id"]: d for d in documents}, ensure_ascii=False), encoding="utf-8")
    meta = [{k: v for k, v in d.items() if k != "markdown"} for d in documents]
    JSON_OUT.write_text(json.dumps({"documents": meta, "chunks": chunks}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(documents)} Dokumente, {len(chunks)} Abschnitte -> {JSON_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
