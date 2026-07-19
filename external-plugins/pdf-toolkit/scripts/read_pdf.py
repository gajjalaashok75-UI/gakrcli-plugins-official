#!/usr/bin/env python3
"""
read_pdf.py
Reads an existing .pdf and prints its content as Markdown or JSON.

Usage:
    python3 read_pdf.py input.pdf --format markdown
    python3 read_pdf.py input.pdf --format json
    python3 read_pdf.py input.pdf --extract-images images/
"""

import argparse
import json
import os
import sys

from pypdf import PdfReader
import pdfplumber


def extract_metadata(reader):
    meta = reader.metadata or {}
    return {
        "title": meta.title if meta else None,
        "author": meta.author if meta else None,
        "subject": meta.subject if meta else None,
        "creator": meta.creator if meta else None,
        "producer": meta.producer if meta else None,
        "page_count": len(reader.pages),
        "encrypted": reader.is_encrypted,
    }


def extract_hyperlinks(reader):
    links = []
    for page_num, page in enumerate(reader.pages):
        annots = page.get("/Annots")
        if not annots:
            continue
        for a in annots:
            obj = a.get_object()
            action = obj.get("/A")
            if action and action.get("/S") == "/URI":
                links.append({"page": page_num, "url": str(action.get("/URI"))})
    return links


def to_markdown(pdf_path):
    reader = PdfReader(pdf_path)
    out_lines = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            out_lines.append(f"## Page {i + 1}")
            out_lines.append("")
            text = page.extract_text() or ""
            out_lines.append(text.strip())
            out_lines.append("")
            tables = page.extract_tables()
            for t_idx, table in enumerate(tables):
                if not table:
                    continue
                header = [str(c or "") for c in table[0]]
                out_lines.append("| " + " | ".join(header) + " |")
                out_lines.append("| " + " | ".join(["---"] * len(header)) + " |")
                for row in table[1:]:
                    out_lines.append("| " + " | ".join(str(c or "") for c in row) + " |")
                out_lines.append("")
    links = extract_hyperlinks(reader)
    if links:
        out_lines.append("**Links found:**")
        for link in links:
            out_lines.append(f"- (page {link['page'] + 1}) {link['url']}")
    return "\n".join(out_lines).strip() + "\n"


def to_json_struct(pdf_path):
    reader = PdfReader(pdf_path)
    result = {"metadata": extract_metadata(reader), "pages": [], "hyperlinks": extract_hyperlinks(reader)}
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            tables = page.extract_tables()
            result["pages"].append({
                "page": i + 1,
                "text": text.strip(),
                "tables": tables,
            })
    return result


def extract_images(pdf_path, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    count = 0
    reader = PdfReader(pdf_path)
    for page_num, page in enumerate(reader.pages):
        resources = page.get("/Resources")
        if not resources:
            continue
        xobjects = resources.get("/XObject")
        if not xobjects:
            continue
        xobjects = xobjects.get_object()
        for name, ref in xobjects.items():
            obj = ref.get_object()
            if obj.get("/Subtype") != "/Image":
                continue
            count += 1
            try:
                data = obj.get_data()
                filt = obj.get("/Filter")
                ext = "jpg" if filt == "/DCTDecode" else "png"
                fname = os.path.join(out_dir, f"page{page_num + 1}_image_{count}.{ext}")
                with open(fname, "wb") as f:
                    f.write(data)
            except Exception as e:
                print(f"[read_pdf] warning: could not extract image {count}: {e}", file=sys.stderr)
    return count


def main():
    parser = argparse.ArgumentParser(description="Read/extract content from a .pdf file")
    parser.add_argument("input", help="Path to the .pdf file")
    parser.add_argument("--format", choices=["markdown", "json"], default="markdown")
    parser.add_argument("--extract-images", metavar="DIR", default=None)
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"error: file not found: {args.input}", file=sys.stderr)
        sys.exit(1)

    if args.extract_images:
        n = extract_images(args.input, args.extract_images)
        print(f"[read_pdf] extracted {n} image(s) to {args.extract_images}", file=sys.stderr)

    if args.format == "json":
        print(json.dumps(to_json_struct(args.input), indent=2, ensure_ascii=False))
    else:
        print(to_markdown(args.input))


if __name__ == "__main__":
    main()
