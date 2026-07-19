#!/usr/bin/env python3
"""
edit_pdf.py
Applies one or more edit operations to an existing .pdf and writes a new file.

Usage:
    python3 edit_pdf.py input.pdf --out output.pdf --ops ops.json

See SKILL.md / USAGE.md for the full ops format. All page indices are
0-based, consistent with docx-toolkit's table_index/row_index convention.

Each op function takes the current PdfReader (reflecting every prior op in
the chain) and returns a PdfWriter with its own result. The main loop
serializes that writer to bytes and reopens it as the reader for the next
op -- and, critically, writes the FINAL writer's bytes directly to disk
rather than copying its pages into one more "final" writer. An earlier
version did that extra copy step and silently dropped document-level
metadata (title/author/etc) in the process, since PdfWriter.add_page() only
copies page content, not the /Info dictionary -- found by actually checking
metadata after set_metadata, not by assuming the copy was lossless.
"""

import argparse
import io
import json
import os
import sys

from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas as canvas_mod
from reportlab.lib.colors import HexColor


def _copy_metadata(reader, writer):
    """
    Every op below builds a fresh PdfWriter, and PdfWriter.add_page() only
    copies page content -- never the document-level /Info dictionary. Ops
    that aren't specifically about changing metadata still need to carry it
    forward explicitly, or chaining any page operation (rotate, watermark,
    page numbers, etc.) silently drops the title/author/subject the file
    already had. Found by checking metadata after a multi-op chain, not by
    assuming add_page() was a complete copy.
    """
    if reader.metadata:
        writer.add_metadata(dict(reader.metadata))


def op_merge(reader, op, ctx):
    """Appends all pages from another PDF (or a list of PDFs) at the end."""
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    paths = op.get("paths") or [op["path"]]
    for p in paths:
        if not os.path.isabs(p):
            p = os.path.join(ctx["base_path"], p)
        other = PdfReader(p)
        for page in other.pages:
            writer.add_page(page)
    _copy_metadata(reader, writer)  # merged file keeps the primary document's metadata by default
    return writer


def op_extract_pages(reader, op, ctx):
    """Keeps only the given 0-based page range [start, end] inclusive."""
    start, end = op["start"], op["end"]
    if not (0 <= start <= end < len(reader.pages)):
        raise ValueError(f"invalid range [{start}, {end}] for a {len(reader.pages)}-page document")
    writer = PdfWriter()
    for i in range(start, end + 1):
        writer.add_page(reader.pages[i])
    _copy_metadata(reader, writer)
    return writer


def op_delete_pages(reader, op, ctx):
    indices = set(op["indices"])
    writer = PdfWriter()
    for i, page in enumerate(reader.pages):
        if i not in indices:
            writer.add_page(page)
    _copy_metadata(reader, writer)
    return writer


def op_rotate_pages(reader, op, ctx):
    indices = op.get("indices")
    degrees = op["degrees"]
    writer = PdfWriter()
    for i, page in enumerate(reader.pages):
        if indices is None or i in indices:
            page.rotate(degrees)
        writer.add_page(page)
    _copy_metadata(reader, writer)
    return writer


def op_reorder_pages(reader, op, ctx):
    order = op["order"]
    if sorted(order) != list(range(len(reader.pages))):
        raise ValueError(f"order must be a permutation of 0..{len(reader.pages) - 1}, got {order}")
    writer = PdfWriter()
    for i in order:
        writer.add_page(reader.pages[i])
    _copy_metadata(reader, writer)
    return writer


def op_insert_blank_page(reader, op, ctx):
    index = op.get("index", len(reader.pages))
    width = op.get("width", float(reader.pages[0].mediabox.width))
    height = op.get("height", float(reader.pages[0].mediabox.height))
    writer = PdfWriter()
    for i, page in enumerate(reader.pages):
        if i == index:
            writer.add_blank_page(width=width, height=height)
        writer.add_page(page)
    if index >= len(reader.pages):
        writer.add_blank_page(width=width, height=height)
    _copy_metadata(reader, writer)
    return writer


def _make_overlay(text, page_width, page_height, position, color, font_size):
    buf = io.BytesIO()
    c = canvas_mod.Canvas(buf, pagesize=(page_width, page_height))
    c.setFillColor(HexColor(f"#{color}"))
    c.setFont("Helvetica", font_size)
    if position == "center":
        c.saveState()
        c.translate(page_width / 2, page_height / 2)
        c.rotate(45)
        c.setFillAlpha(0.3)
        c.drawCentredString(0, 0, text)
        c.restoreState()
    elif position == "bottom-center":
        c.drawCentredString(page_width / 2, 0.4 * 72, text)
    elif position == "bottom-right":
        c.drawRightString(page_width - 0.5 * 72, 0.4 * 72, text)
    elif position == "top-center":
        c.drawCentredString(page_width / 2, page_height - 0.5 * 72, text)
    else:
        raise ValueError(f"unknown position '{position}'")
    c.save()
    buf.seek(0)
    return PdfReader(buf).pages[0]


def op_add_watermark(reader, op, ctx):
    text = op.get("text", "DRAFT")
    color = op.get("color", "C0C0C0").lstrip("#")
    writer = PdfWriter()
    for page in reader.pages:
        w, h = float(page.mediabox.width), float(page.mediabox.height)
        overlay = _make_overlay(text, w, h, "center", color, 54)
        page.merge_page(overlay)
        writer.add_page(page)
    _copy_metadata(reader, writer)
    return writer


def op_add_page_numbers(reader, op, ctx):
    position = op.get("position", "bottom-center")
    fmt = op.get("format", "Page {n} of {total}")
    color = op.get("color", "000000").lstrip("#")
    total = len(reader.pages)
    writer = PdfWriter()
    for i, page in enumerate(reader.pages):
        w, h = float(page.mediabox.width), float(page.mediabox.height)
        text = fmt.replace("{n}", str(i + 1)).replace("{total}", str(total))
        overlay = _make_overlay(text, w, h, position, color, 9)
        page.merge_page(overlay)
        writer.add_page(page)
    _copy_metadata(reader, writer)
    return writer


def op_set_metadata(reader, op, ctx):
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    existing = dict(reader.metadata) if reader.metadata else {}
    field_map = {
        "title": "/Title", "author": "/Author", "subject": "/Subject",
        "keywords": "/Keywords", "creator": "/Creator",
    }
    for key, pdf_key in field_map.items():
        if key in op:
            existing[pdf_key] = op[key]
    writer.add_metadata(existing)
    return writer


def op_encrypt(reader, op, ctx):
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    if reader.metadata:
        writer.add_metadata(dict(reader.metadata))
    user_pw = op["user_password"]
    owner_pw = op.get("owner_password", user_pw)
    writer.encrypt(user_pw, owner_pw)
    return writer


def op_decrypt(reader, op, ctx):
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    if reader.metadata:
        writer.add_metadata(dict(reader.metadata))
    return writer


OP_HANDLERS = {
    "merge": op_merge,
    "extract_pages": op_extract_pages,
    "delete_pages": op_delete_pages,
    "rotate_pages": op_rotate_pages,
    "reorder_pages": op_reorder_pages,
    "insert_blank_page": op_insert_blank_page,
    "add_watermark": op_add_watermark,
    "add_page_numbers": op_add_page_numbers,
    "set_metadata": op_set_metadata,
    "encrypt": op_encrypt,
    "decrypt": op_decrypt,
}


def main():
    parser = argparse.ArgumentParser(description="Edit an existing .pdf file")
    parser.add_argument("input", help="Path to the source .pdf file")
    parser.add_argument("--out", required=True, help="Path to write the edited .pdf file")
    parser.add_argument("--ops", required=True, help="Path to a JSON file listing operations")
    parser.add_argument("--password", default=None, help="Password to open the input PDF, if encrypted")
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"error: file not found: {args.input}", file=sys.stderr)
        sys.exit(1)

    with open(args.ops, encoding="utf-8") as f:
        ops = json.load(f)
    if not ops:
        print("error: no operations given", file=sys.stderr)
        sys.exit(1)

    reader = PdfReader(args.input)
    if reader.is_encrypted:
        reader.decrypt(args.password if args.password else "")

    ctx = {"base_path": os.path.dirname(os.path.abspath(args.input))}

    writer = None
    last_encrypt_password = None
    for op in ops:
        op_type = op.get("op")
        handler = OP_HANDLERS.get(op_type)
        if not handler:
            print(f"error: unknown op '{op_type}'", file=sys.stderr)
            sys.exit(1)
        writer = handler(reader, op, ctx)
        if op_type == "encrypt":
            last_encrypt_password = op["user_password"]
        elif op_type != "decrypt":
            # Any non-encrypt/decrypt op after an encrypt would need its own
            # re-encryption to still be protected -- op functions don't do
            # that automatically, so track that the final state is no
            # longer meaningfully "the encrypted one" for self-check purposes.
            last_encrypt_password = None
        buf = io.BytesIO()
        writer.write(buf)
        buf.seek(0)
        reader = PdfReader(buf)
        if reader.is_encrypted:
            # The writer we just serialized was encrypted (last op was
            # 'encrypt') -- decrypt before the NEXT op tries to touch pages,
            # or anything chained after encrypt (including 'decrypt' itself)
            # would crash trying to access an encrypted reader's page tree.
            reader.decrypt(last_encrypt_password or "")

    with open(args.out, "wb") as f:
        writer.write(f)

    try:
        check = PdfReader(args.out)
        if check.is_encrypted:
            # The output is SUPPOSED to be encrypted (the last op was
            # encrypt) -- verify by actually decrypting with the password
            # just used, rather than treating "still encrypted" as failure.
            if last_encrypt_password is None:
                raise RuntimeError("output is encrypted but no encryption password was tracked for self-check")
            result = check.decrypt(last_encrypt_password)
            if result == 0:
                raise RuntimeError("could not decrypt output with the password just used to encrypt it")
        _ = len(check.pages)
    except Exception as e:
        print(f"error: output file failed validation after write: {e}", file=sys.stderr)
        sys.exit(1)

    size = os.path.getsize(args.out)
    print(f"Wrote {args.out} ({size} bytes), applied {len(ops)} operation(s)")


if __name__ == "__main__":
    main()
