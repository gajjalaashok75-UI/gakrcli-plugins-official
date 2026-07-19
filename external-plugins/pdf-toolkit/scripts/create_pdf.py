#!/usr/bin/env python3
"""
create_pdf.py
Builds a new .pdf file from a JSON spec, using reportlab's Platypus layout
engine (flowables laid out top-to-bottom with automatic page breaks) rather
than raw canvas drawing -- this gives word-wrap, page-break-aware tables, and
consistent spacing "for free" instead of hand-computing every position.

Usage:
    python3 create_pdf.py --spec spec.json --out output.pdf
    cat spec.json | python3 create_pdf.py --out output.pdf

See SKILL.md / USAGE.md for the full spec format.
"""

import argparse
import json
import os
import sys

from reportlab.lib.pagesizes import letter, A4, landscape
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image,
)
from reportlab.pdfgen import canvas as canvas_mod

PAGE_SIZES = {"letter": letter, "a4": A4}
ALIGN_MAP = {"left": TA_LEFT, "center": TA_CENTER, "right": TA_RIGHT, "justify": TA_JUSTIFY}


def esc(text):
    """Escape text for reportlab's paragraph mini-XML markup."""
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def build_run_markup(run):
    text = esc(run.get("text", ""))
    if run.get("link"):
        text = f'<a href="{esc(run["link"])}" color="#0563C1"><u>{text}</u></a>'
        return text
    if run.get("bold"):
        text = f"<b>{text}</b>"
    if run.get("italic"):
        text = f"<i>{text}</i>"
    if run.get("underline"):
        text = f"<u>{text}</u>"
    if run.get("color"):
        text = f'<font color="#{run["color"].lstrip("#")}">{text}</font>'
    if run.get("highlight"):
        # reportlab has no native text-highlight tag; approximate with a
        # background-colored <font> isn't supported either, so fall back to
        # a visibly distinct color instead of silently dropping the intent.
        text = f'<font color="#{_highlight_to_fg(run["highlight"])}">{text}</font>'
    return text


def _highlight_to_fg(name):
    # No true highlight/background support in reportlab paragraphs; use a
    # readable foreground color as the closest available approximation
    # rather than silently ignoring the highlight request.
    mapping = {
        "yellow": "B8860B", "green": "006400", "cyan": "008B8B",
        "magenta": "8B008B", "red": "B22222", "blue": "00008B",
    }
    return mapping.get(name.lower(), "000000")


def build_paragraph_style(section, base_style, styles):
    align = ALIGN_MAP.get(section.get("align"), base_style.alignment)
    style = ParagraphStyle(
        f"custom_{id(section)}",
        parent=base_style,
        alignment=align,
    )
    indent = section.get("indent", {})
    if "left" in indent:
        style.leftIndent = indent["left"] * inch
    if "right" in indent:
        style.rightIndent = indent["right"] * inch
    if "firstLine" in indent:
        style.firstLineIndent = indent["firstLine"] * inch
    spacing = section.get("spacing", {})
    if "before" in spacing:
        style.spaceBefore = spacing["before"]
    if "after" in spacing:
        style.spaceAfter = spacing["after"]
    return style


def build_heading_style(level, styles, heading_color, heading_font):
    sizes = {1: 20, 2: 16, 3: 13, 4: 12}
    spacing_before = {1: 18, 2: 14, 3: 10, 4: 8}
    spacing_after = {1: 10, 2: 8, 3: 6, 4: 4}
    return ParagraphStyle(
        f"Heading{level}Custom",
        parent=styles["Normal"],
        fontName=f"{heading_font}-Bold" if heading_font == "Helvetica" else heading_font,
        fontSize=sizes.get(level, 12),
        textColor=colors.HexColor(f"#{heading_color}"),
        spaceBefore=spacing_before.get(level, 8),
        spaceAfter=spacing_after.get(level, 6),
    )


def build_flowable(section, styles, ctx):
    t = section["type"]

    if t == "heading":
        level = section.get("level", 1)
        style = build_heading_style(level, styles, ctx["heading_color"], ctx["heading_font"])
        return Paragraph(esc(section.get("text", "")), style)

    if t == "paragraph":
        base = styles["Normal"]
        style = build_paragraph_style(section, base, styles)
        if "runs" in section:
            text = "".join(build_run_markup(r) for r in section["runs"])
        else:
            text = esc(section.get("text", ""))
        return Paragraph(text, style)

    if t in ("bulletList", "numberedList"):
        style = ParagraphStyle(
            f"list_{id(section)}", parent=styles["Normal"], leftIndent=18, spaceAfter=2,
        )
        flowables = []
        for idx, item in enumerate(section["items"]):
            prefix = f"{idx + 1}." if t == "numberedList" else "-"
            flowables.append(Paragraph(f"{prefix} {esc(item)}", style))
        return flowables

    if t == "table":
        rows = section["rows"]
        col_widths = section.get("columnWidths")
        if col_widths:
            col_widths = [w for w in col_widths]
        data = [[Paragraph(esc(str(cell)), styles["Normal"]) for cell in row] for row in rows]
        table = Table(data, colWidths=col_widths)
        ts = [
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#999999")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]
        if section.get("header", True):
            header_color = section.get("headerColor", "D9D9D9").lstrip("#")
            ts.append(("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(f"#{header_color}")))
            ts.append(("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"))
        table.setStyle(TableStyle(ts))
        return table

    if t == "image":
        img_path = section["path"]
        if not os.path.isabs(img_path):
            img_path = os.path.join(ctx["base_path"], img_path)
        width = section.get("width", 300)
        height = section.get("height", 200)
        return Image(img_path, width=width * 0.75, height=height * 0.75)  # px -> pt approx (96->72 dpi)

    if t == "pageBreak":
        return PageBreak()

    if t == "spacer":
        return Spacer(1, section.get("height", 12))

    raise ValueError(f"Unknown section type: {t}")


def draw_header_footer(canvas_obj, doc, header_text, footer_text):
    canvas_obj.saveState()
    width, height = doc.pagesize
    if header_text:
        canvas_obj.setFont("Helvetica", 9)
        canvas_obj.drawCentredString(width / 2, height - 0.5 * inch, header_text)
    if footer_text:
        canvas_obj.setFont("Helvetica", 9)
        canvas_obj.drawCentredString(width / 2, 0.4 * inch, footer_text)
    canvas_obj.restoreState()


def build_pdf(spec, out_path, base_path):
    page_size_name = spec.get("pageSize", "letter").lower()
    page_size = PAGE_SIZES.get(page_size_name, letter)
    if spec.get("orientation", "portrait").lower() == "landscape":
        page_size = landscape(page_size)

    margins = spec.get("margins", {})
    doc = SimpleDocTemplate(
        out_path,
        pagesize=page_size,
        topMargin=margins.get("top", 1) * inch,
        bottomMargin=margins.get("bottom", 1) * inch,
        leftMargin=margins.get("left", 1) * inch,
        rightMargin=margins.get("right", 1) * inch,
        title=spec.get("metadata", {}).get("title", ""),
        author=spec.get("metadata", {}).get("author", ""),
        subject=spec.get("metadata", {}).get("subject", ""),
    )

    styles = getSampleStyleSheet()
    default_font_size = spec.get("defaultFontSize", 11)
    styles["Normal"].fontSize = default_font_size
    styles["Normal"].leading = default_font_size * 1.3

    ctx = {
        "base_path": base_path,
        "heading_color": spec.get("headingColor", "1F4E79").lstrip("#"),
        "heading_font": spec.get("headingFont", "Helvetica"),
    }

    story = []
    for s in spec.get("sections", []):
        result = build_flowable(s, styles, ctx)
        if isinstance(result, list):
            story.extend(result)
        else:
            story.append(result)

    header_text = spec.get("header")
    footer_text = spec.get("footer")
    if isinstance(header_text, dict):
        header_text = header_text.get("text", "")
    if isinstance(footer_text, dict):
        footer_text = footer_text.get("text", "")

    def on_page(canvas_obj, doc_obj):
        draw_header_footer(canvas_obj, doc_obj, header_text, footer_text)

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)


def main():
    parser = argparse.ArgumentParser(description="Create a .pdf file from a JSON spec")
    parser.add_argument("--spec", default=None, help="Path to spec JSON (default: stdin)")
    parser.add_argument("--out", required=True, help="Output .pdf path")
    args = parser.parse_args()

    raw = open(args.spec, encoding="utf-8").read() if args.spec else sys.stdin.read()
    spec = json.loads(raw)

    base_path = os.path.dirname(args.spec) if args.spec else os.getcwd()
    build_pdf(spec, args.out, base_path)

    size = os.path.getsize(args.out)
    if size < 100:
        print("error: output file suspiciously small", file=sys.stderr)
        sys.exit(1)
    print(f"Created {args.out} ({size} bytes)")


if __name__ == "__main__":
    main()
