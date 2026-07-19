# pdf-toolkit — Usage Guide

Copy-pasteable examples for every operation. **MCP tool calls are shown first and are the preferred form.** The equivalent CLI command follows each one.

Quick reference: `pdf_help()` for the full index, or `pdf_help(topic="edit_ops")` / `pdf_help(topic="create_spec")` for one section.

**All MCP path arguments must be absolute.** CLI paths resolve against your shell's current directory as normal.

---

## 1. Create — full example

**MCP:**
```
pdf_create(
  spec={
    "pageSize": "letter",
    "metadata": {"title": "Sample Report", "author": "Your Name"},
    "headingColor": "1F4E79",
    "header": "Confidential",
    "footer": "Page footer",
    "sections": [
      {"type": "heading", "level": 1, "text": "Overview"},
      {"type": "paragraph", "runs": [
          {"text": "This report covers "},
          {"text": "Q3 2026", "bold": true, "color": "1F4E79"},
          {"text": " performance."}
        ]},
      {"type": "bulletList", "items": ["Revenue up 12%", "Two new hires"]},
      {"type": "numberedList", "items": ["Finalize budget", "Ship release"]},
      {"type": "table", "columnWidths": [150, 150], "headerColor": "1F4E79",
        "rows": [["Metric", "Q3"], ["Revenue", "$1.35M"]]},
      {"type": "pageBreak"},
      {"type": "heading", "level": 2, "text": "Appendix"},
      {"type": "paragraph", "text": "End of report."}
    ]
  },
  output_path="/absolute/path/to/report.pdf"
)
```

**CLI equivalent:** save the `spec` object as `spec.json`, then:
```bash
python3 scripts/create_pdf.py --spec spec.json --out report.pdf
```

### Every section type, individually

```json
{ "type": "heading", "level": 1, "text": "Section Title" }
```
```json
{ "type": "paragraph", "text": "Plain paragraph." }
```
```json
{ "type": "paragraph", "runs": [
    { "text": "Bold red ", "bold": true, "color": "CC0000" },
    { "text": "italic ", "italic": true },
    { "text": "underlined ", "underline": true }
  ] }
```
```json
{ "type": "paragraph", "runs": [{ "text": "Click here", "link": "https://example.com" }] }
```
Produces a real clickable link annotation, not just colored/underlined text.
```json
{ "type": "paragraph", "text": "Centered.", "align": "center" }
```
```json
{ "type": "bulletList", "items": ["A", "B"] }
```
```json
{ "type": "numberedList", "items": ["First", "Second"] }
```
```json
{ "type": "table", "columnWidths": [150, 150], "headerColor": "336699",
  "rows": [["Col1", "Col2"], ["a", "b"]] }
```
```json
{ "type": "image", "path": "photo.png", "width": 300, "height": 200 }
```
```json
{ "type": "pageBreak" }
```
```json
{ "type": "spacer", "height": 12 }
```

---

## 2. Read — every mode

**MCP:**
```
pdf_read(input_path="/absolute/path/to/report.pdf", format="markdown")
pdf_read(input_path="/absolute/path/to/report.pdf", format="json")
pdf_read(input_path="/absolute/path/to/report.pdf", extract_images_dir="/absolute/path/to/images/")
```

**CLI equivalent:**
```bash
python3 scripts/read_pdf.py report.pdf --format markdown
python3 scripts/read_pdf.py report.pdf --format json
python3 scripts/read_pdf.py report.pdf --extract-images ./images/
```

`json` output shape:
```json
{
  "metadata": { "title": "...", "author": "...", "subject": "...", "creator": "...",
                "producer": "...", "page_count": 2, "encrypted": false },
  "pages": [ { "page": 1, "text": "...", "tables": [[["Col1","Col2"], ["a","b"]]] } ],
  "hyperlinks": [ { "page": 0, "url": "https://example.com" } ]
}
```

---

## 3. Edit — every operation

All examples assume `report.pdf` from step 1. All page indices are **0-based**.

**MCP form:**
```
pdf_edit(
  input_path="/absolute/path/to/report.pdf",
  output_path="/absolute/path/to/output.pdf",
  ops=[ ...one or more operation objects from below... ]
)
```

**CLI form:**
```bash
python3 scripts/edit_pdf.py report.pdf --out output.pdf --ops ops.json
```

**merge** (append another PDF's pages, or several)
```json
[{ "op": "merge", "path": "appendix.pdf" }]
```
```json
[{ "op": "merge", "paths": ["appendix1.pdf", "appendix2.pdf"] }]
```

**extract_pages** (keep only this 0-based inclusive range, discard the rest)
```json
[{ "op": "extract_pages", "start": 0, "end": 2 }]
```

**delete_pages**
```json
[{ "op": "delete_pages", "indices": [1, 3] }]
```

**rotate_pages** (degrees should be a multiple of 90; omit `indices` to rotate all pages)
```json
[{ "op": "rotate_pages", "indices": [0], "degrees": 90 }]
```

**reorder_pages** (a full permutation of every page index)
```json
[{ "op": "reorder_pages", "order": [2, 0, 1] }]
```

**insert_blank_page**
```json
[{ "op": "insert_blank_page", "index": 1 }]
```

**add_watermark**
```json
[{ "op": "add_watermark", "text": "DRAFT", "color": "C0C0C0" }]
```

**add_page_numbers**
```json
[{ "op": "add_page_numbers", "position": "bottom-center", "format": "Page {n} of {total}" }]
```
Valid `position`: `bottom-center` (default), `bottom-right`, `top-center`.

**set_metadata** (preserves fields not specified)
```json
[{ "op": "set_metadata", "title": "Final Report", "author": "Jane Doe" }]
```

**encrypt**
```json
[{ "op": "encrypt", "user_password": "secret123", "owner_password": "owner456" }]
```
`owner_password` defaults to `user_password` if omitted.

**decrypt** (needs the password passed to `pdf_edit`/CLI itself, not inside the op)
```
pdf_edit(input_path="...", output_path="...", ops=[{"op": "decrypt"}], password="secret123")
```
```bash
python3 scripts/edit_pdf.py encrypted.pdf --out decrypted.pdf --ops ops.json --password secret123
```

**Chaining multiple operations:**
```json
[
  { "op": "delete_pages", "indices": [3] },
  { "op": "add_watermark", "text": "CONFIDENTIAL" },
  { "op": "add_page_numbers" },
  { "op": "set_metadata", "title": "Final" }
]
```

---

## 4. Validate

**MCP:**
```
pdf_lint(input_path="/absolute/path/to/output.pdf")
```
For an encrypted file:
```
pdf_lint(input_path="/absolute/path/to/output.pdf", password="secret123")
```

**CLI:**
```bash
python3 scripts/lint_pdf.py output.pdf
python3 scripts/lint_pdf.py output.pdf --password secret123
```

Checks page count consistency, per-page readability, and (if `qpdf` is installed) runs a real independent structural check via `qpdf --check`.

---

## 5. Get help mid-task

```
pdf_help()                       → index of tools + available topics
pdf_help(topic="pdf_create")     → pdf_create's arguments
pdf_help(topic="pdf_edit")       → pdf_edit's arguments
pdf_help(topic="create_spec")    → full section-type reference
pdf_help(topic="edit_ops")       → all 11 edit operations with their arguments
pdf_help(topic="out_of_scope")   → what this toolkit deliberately doesn't support
```

---

## 6. Debugging workflow

1. **Reproduce minimally** — strip the spec/ops down to just the suspect part.
2. **Run `pdf_lint`** first — fast, catches structural issues.
3. **Inspect with `qpdf`** directly if installed: `qpdf --check file.pdf` or `qpdf --qdf file.pdf readable.pdf` to get a human-readable version of the raw PDF structure.
4. **Extract text/tables and eyeball them**: `pdf_read(format="json")` shows exactly what was parsed per page.
5. **Compare against `test-output/`** — files already validated clean.

## 7. What's out of scope

See `SKILL.md` §9 or `pdf_help(topic="out_of_scope")`.
