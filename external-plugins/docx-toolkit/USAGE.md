# docx-toolkit — Usage Guide

Copy-pasteable examples for every operation. **MCP tool calls are shown first and are the preferred form** — call them directly by tool name with the arguments shown; no need to locate scripts or manage paths relative to a script's location. The equivalent CLI command follows each one for reference/fallback.

Quick reference without leaving your task: call `docx_help()` for the full index, or `docx_help(topic="edit_ops")` / `docx_help(topic="create_spec")` / `docx_help(topic="colors")` / `docx_help(topic="out_of_scope")` for just one section.

**All MCP path arguments must be absolute.** CLI paths resolve against your shell's current directory as normal.

---

## 1. Create — full example

**MCP:**
```
docx_create(
  spec={
    "title": "Sample Report",
    "pageSize": "letter",
    "orientation": "portrait",
    "margins": {"top": 1, "bottom": 1, "left": 1, "right": 1},
    "defaultFont": "Calibri",
    "defaultFontSize": 11,
    "headingColor": "1F4E79",
    "metadata": {"title": "Sample Report", "author": "Your Name"},
    "header": "Confidential",
    "footer": {"text": "Page footer", "align": "center"},
    "sections": [
      {"type": "heading", "level": 1, "text": "Overview"},
      {"type": "paragraph", "runs": [
          {"text": "This report covers "},
          {"text": "Q3 2026", "bold": true, "color": "1F4E79"},
          {"text": " performance."}
        ]},
      {"type": "bulletList", "items": ["Revenue up 12%", "Two new hires"]},
      {"type": "numberedList", "format": "upperRoman", "items": ["Finalize budget", "Ship release"]},
      {"type": "table", "columnWidths": [3000, 3000], "headerColor": "1F4E79",
        "rows": [["Metric", "Q3"], ["Revenue", "$1.35M"]]},
      {"type": "image", "path": "chart.png", "width": 400, "height": 250},
      {"type": "shape", "text": "Key takeaway", "width": 250, "height": 80, "bold": true},
      {"type": "pageBreak"},
      {"type": "heading", "level": 2, "text": "Appendix"},
      {"type": "paragraph", "text": "End of report."}
    ]
  },
  output_path="/absolute/path/to/report.docx"
)
```

**CLI equivalent:** save the `spec` object above as `spec.json`, then:
```bash
node scripts/create_docx.js --spec spec.json --out report.docx
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
    { "text": "underlined ", "underline": true },
    { "text": "highlighted", "highlight": "yellow" }
  ] }
```
```json
{ "type": "paragraph", "runs": [{ "text": "Click here", "link": "https://example.com" }] }
```
```json
{ "type": "paragraph", "text": "Centered, indented, spaced.", "align": "center",
  "indent": { "left": 0.5 }, "spacing": { "before": 12, "after": 12 } }
```
```json
{ "type": "bulletList", "items": ["A", "B"] }
```
```json
{ "type": "numberedList", "format": "lowerLetter", "items": ["First", "Second"] }
```
Valid `format` values: `bullet`, `decimal`, `upperRoman`, `lowerRoman`, `upperLetter`, `lowerLetter`.
```json
{ "type": "table", "columnWidths": [3000, 3000], "headerColor": "336699",
  "cellVerticalAlign": "center", "rows": [["Col1", "Col2"], ["a", "b"]] }
```
```json
{ "type": "image", "path": "photo.png", "width": 300, "height": 200 }
```
```json
{ "type": "shape", "text": "Callout text", "width": 200, "height": 100, "bold": true }
```
```json
{ "type": "pageBreak" }
```

---

## 2. Read — every mode

**MCP:**
```
docx_read(input_path="/absolute/path/to/report.docx", format="markdown")
docx_read(input_path="/absolute/path/to/report.docx", format="json")
docx_read(input_path="/absolute/path/to/report.docx", extract_images_dir="/absolute/path/to/images/")
docx_read(input_path="/absolute/path/to/report.docx", format="json", extract_images_dir="/absolute/path/to/images/")
```

**CLI equivalent:**
```bash
python3 scripts/read_docx.py report.docx --format markdown
python3 scripts/read_docx.py report.docx --format json
python3 scripts/read_docx.py report.docx --extract-images ./images/
```

`json` output shape:
```json
{
  "paragraphs": [{ "text": "...", "style": "Heading 1" }],
  "headings": [{ "text": "...", "style": "Heading 1" }],
  "tables": [[["Col1","Col2"], ["a","b"]]],
  "headers": ["Confidential"],
  "footers": ["Page footer"],
  "hyperlinks": [{ "id": "rId5", "url": "https://example.com" }],
  "metadata": { "title": "...", "author": "...", "subject": "...", "keywords": "...",
                "category": "...", "comments": "...", "language": "...", "last_modified_by": "..." }
}
```

---

## 3. Edit — every operation

All examples assume `report.docx` from step 1.

**MCP form** (wraps any ops list shown below):
```
docx_edit(
  input_path="/absolute/path/to/report.docx",
  output_path="/absolute/path/to/output.docx",
  ops=[ ...one or more operation objects from below... ]
)
```

**CLI form:**
```bash
python3 scripts/edit_docx.py report.docx --out output.docx --ops ops.json
```
(where `ops.json` contains the same array you'd pass as `ops` above)

**find_replace**
```json
[{ "op": "find_replace", "find": "Q3 2026", "replace": "Q3-2026 (FY26)" }]
```

**append_paragraph** (plain, or mixed formatting via `runs`)
```json
[{ "op": "append_paragraph", "text": "Simple line." }]
```
```json
[{ "op": "append_paragraph", "runs": [
    { "text": "Warning: ", "bold": true, "color": "CC0000" },
    { "text": "review this section", "highlight": "yellow" }
  ] }]
```

**append_heading**
```json
[{ "op": "append_heading", "level": 2, "text": "New Section" }]
```

**append_table**
```json
[{ "op": "append_table", "rows": [["Item", "Cost"], ["License", "$500"]] }]
```

**append_image**
```json
[{ "op": "append_image", "path": "signature.png", "width": 200, "height": 80 }]
```

**insert_page_break**
```json
[{ "op": "insert_page_break" }]
```

**add_comment** (real Word review comment, anchored to text)
```json
[{ "op": "add_comment", "anchor": "Q3-2026", "text": "Confirm this figure.", "author": "Reviewer", "initials": "RV" }]
```

**insert_hyperlink**
```json
[{ "op": "insert_hyperlink", "url": "https://example.com/docs", "text": "See documentation" }]
```

**set_header / set_footer**
```json
[{ "op": "set_header", "text": "Draft — Internal Use Only" }]
```
```json
[{ "op": "set_footer", "text": "Confidential" }]
```

**resize_image** (0-indexed, in document order)
```json
[{ "op": "resize_image", "index": 0, "width": 150, "height": 100 }]
```

**remove_page / move_page** (operates on explicit page-break boundaries — see SKILL.md §7)
```json
[{ "op": "remove_page", "index": 1 }]
```
```json
[{ "op": "move_page", "from": 2, "to": 0 }]
```

**set_metadata**
```json
[{ "op": "set_metadata", "title": "Final Report", "author": "Jane Doe", "keywords": "q3, finance" }]
```

**format_paragraph** (targets the paragraph containing `anchor` text)
```json
[{ "op": "format_paragraph", "anchor": "End of report", "align": "center",
   "indent": { "left": 0.3 }, "spacing": { "before": 6, "after": 6 }, "keepWithNext": true }]
```

**Table structure ops** (`table_index` is 0-based, in document order)
```json
[{ "op": "add_table_row", "table_index": 0, "cells": ["Growth", "18%"] }]
```
```json
[{ "op": "delete_table_row", "table_index": 0, "row_index": 1 }]
```
```json
[{ "op": "add_table_column", "table_index": 0, "cells": ["Notes", "On track"], "width": 2000 }]
```
```json
[{ "op": "delete_table_column", "table_index": 0, "col_index": 2 }]
```
```json
[{ "op": "merge_cells", "table_index": 0, "start": [1, 0], "end": [1, 1] }]
```
```json
[{ "op": "set_cell_shading", "table_index": 0, "cell": [0, 0], "color": "FFD700" }]
```
```json
[{ "op": "set_table_borders", "table_index": 0 }]
```

**add_bookmark**
```json
[{ "op": "add_bookmark", "anchor": "Overview", "name": "doc_start" }]
```

**insert_page_number_field / insert_toc_field** (Word computes actual values on open/F9)
```json
[{ "op": "insert_page_number_field", "target": "footer" }]
```
```json
[{ "op": "insert_toc_field" }]
```

**set_orientation / set_margins**
```json
[{ "op": "set_orientation", "orientation": "landscape" }]
```
```json
[{ "op": "set_margins", "top": 0.5, "bottom": 0.5, "left": 0.75, "right": 0.75 }]
```

**add_watermark**
```json
[{ "op": "add_watermark", "text": "DRAFT", "color": "C0C0C0" }]
```

**Chaining multiple operations in one call** (they run in array order):
```json
[
  { "op": "find_replace", "find": "Draft", "replace": "Final" },
  { "op": "append_heading", "level": 2, "text": "Sign-off" },
  { "op": "add_comment", "anchor": "Sign-off", "text": "Add signature block", "author": "PM" },
  { "op": "set_table_borders", "table_index": 0 }
]
```

**Single-op CLI shorthand** (no ops.json needed, CLI only):
```bash
python3 scripts/edit_docx.py report.docx --out output.docx --find "Q3 2026" --replace "Q3-2026"
```

---

## 4. Validate

**MCP:**
```
docx_lint(input_path="/absolute/path/to/output.docx")
```

**CLI:**
```bash
python3 scripts/lint_docx.py output.docx
```

### What it catches vs. doesn't

Neither `python-docx` nor LibreOffice enforce everything real Word does — both will silently open files Word rejects. `docx_lint`/`lint_docx.py` catches the specific bug classes already found and fixed in this toolkit (paragraph/pPr ordering, table-cell property sequence, missing `gridCol` width, duplicate shading, section-properties placement, bookmark balance) but is **not a full schema validator**. If debugging a new "Word won't open this" report, the reliable way to confirm the actual defect is validating the relevant XML part directly against the real ISO/IEC 29500 WordprocessingML XSD schema — `SKILL.md` §12 documents exactly this process for the bugs found so far.

### Optional visual check (if LibreOffice is installed)
```bash
soffice --headless --convert-to pdf output.docx
pdftoppm -jpeg -r 100 output.pdf page
```

---

## 5. Get help mid-task

**MCP:**
```
docx_help()                        → index of tools + available topics
docx_help(topic="docx_create")     → docx_create's arguments
docx_help(topic="docx_edit")       → docx_edit's arguments
docx_help(topic="docx_read")       → docx_read's arguments
docx_help(topic="docx_lint")       → docx_lint's arguments
docx_help(topic="create_spec")     → full section-type reference for docx_create
docx_help(topic="edit_ops")        → all 28 edit operations with their arguments
docx_help(topic="colors")          → valid color/highlight values
docx_help(topic="out_of_scope")    → what this toolkit deliberately doesn't support
```

There's no CLI equivalent for this — it's an MCP-only convenience tool. For the CLI, this document and `SKILL.md` are the reference.

---

## 6. Debugging workflow

When something looks wrong (crashes, won't open, renders oddly):

1. **Reproduce minimally.** Strip your spec/ops down to just the section or operation you suspect.
2. **Run `docx_lint`/`lint_docx.py`** on the output first — fast, catches the known bug classes.
3. **Inspect the raw XML.** A `.docx` is a zip:
   ```bash
   unzip -o output.docx -d unzipped/
   cat unzipped/word/document.xml | python3 -c "import sys,xml.dom.minidom as m; print(m.parseString(sys.stdin.read()).toprettyxml())" | less
   ```
4. **Check `word/document.xml.rels`** if a hyperlink, image, or header/footer isn't showing up — every `r:id` referenced in the XML needs a matching entry there.
5. **Compare against a known-good file.** `test-output/` contains files already validated clean, generated via the MCP server itself — diff your output's XML against theirs for the same construct.
6. **Render to PDF** (§4) to see it visually before assuming a structural bug.

---

## 7. Comparing output quality / style

If output looks stylistically different from another document (wrong font, flat-looking headings, no visual hierarchy), it's very likely a **document defaults** issue, not a bug — see `SKILL.md` §11. Set `defaultFont`, `defaultFontSize`, `headingFont`, and `headingColor` explicitly in your spec rather than relying on fallback behavior; the `docx` library underlying `docx_create` sets no defaults of its own, so an unset value means "whatever Word falls back to," not "a neutral default."

If editing an existing file and new content doesn't match the file's existing look, check what named styles that file actually defines — `append_heading` and other style-dependent operations fall back to manual bold/sized formatting when a file lacks the exact style name they'd otherwise use (see `SKILL.md` §8), which will look different from a heading using the file's real style.

---

## 8. What's out of scope

See `SKILL.md` §13 or call `docx_help(topic="out_of_scope")` for the full list (VBA, OLE embeds, digital signatures, SmartArt, charts, equations, mail merge, image effects, footnotes/endnotes, track-changes accept/reject). Don't spend time debugging these as if they were partially implemented — they're not implemented at all.
