---
name: pdf-toolkit
description: "Use this skill any time the agent needs to create a new PDF document, read/extract content from an existing one, or modify/update an existing one — text, tables, images, hyperlinks, headers/footers, page setup, merging, splitting, rotating, page numbers, watermarks, or encryption. Trigger on requests mentioning 'PDF', '.pdf', or any request to generate, summarize, merge, split, rotate, watermark, encrypt, or restructure a PDF file. Covers create (build a new .pdf from a structured spec), read (extract text/tables/hyperlinks/metadata from an existing .pdf into markdown/JSON), and edit (apply one or more of 11 operations to an existing .pdf in place). Prefer the MCP server (pdf_create/pdf_read/pdf_edit/pdf_lint/pdf_help tools) over the CLI scripts when available — it works from any working directory without locating files on disk first."
compatibility: "MCP server: Node.js with @modelcontextprotocol/sdk (see MCP.md). CLI scripts and MCP server both shell out to Python 3.9+ (pypdf, pdfplumber, reportlab) for every operation -- there's no Node-only path for PDF creation the way docx-toolkit has one for docx. qpdf is optional, used only by pdf_lint's independent structural check. See setup.sh."
---

# pdf-toolkit

Creates, reads, and edits `.pdf` files. Two ways to use it:

- **MCP server** (`server.js`, registered via `.mcp.json`) — five tools: `pdf_create`, `pdf_read`, `pdf_edit`, `pdf_lint`, `pdf_help`. Call them directly with structured arguments from any working directory. **This is the preferred way to use this skill** whenever an MCP client is available.
- **CLI scripts** (`scripts/*.py`) — the same operations as direct command-line invocations. Useful as a fallback when no MCP client is available.

Both paths run the exact same Python scripts — there's no behavioral difference, only how you invoke them. Unlike docx-toolkit (which splits Node for creation / Python for editing), every PDF operation here is Python-based (`reportlab` for creation, `pypdf` + `pdfplumber` for reading/editing) since Python's PDF libraries are the mature, natural choice for all of it — the Node MCP server is a pure orchestrator that shells out for everything.

## 1. Setup

```bash
bash setup.sh
```
Installs Node dependencies (`@modelcontextprotocol/sdk`, `zod`) and Python dependencies (`pypdf`, `pdfplumber`, `reportlab`). `qpdf` is optional — used only by `pdf_lint`'s independent structural check; without it, `pdf_lint` still runs its pypdf-level checks.

## 2. Using the MCP server (preferred)

**Get oriented:**
```
pdf_help()                          → index of all tools and topics
pdf_help(topic="edit_ops")          → every edit operation with its arguments
pdf_help(topic="create_spec")       → full create-spec section-type reference
```

**Create a document:**
```
pdf_create(
  spec={
    "metadata": {"title": "Quarterly Report", "author": "..."},
    "sections": [
      {"type": "heading", "level": 1, "text": "Overview"},
      {"type": "paragraph", "text": "This report covers Q3 performance."}
    ]
  },
  output_path="/absolute/path/to/report.pdf"
)
```

**Read a document:**
```
pdf_read(input_path="/absolute/path/to/report.pdf", format="markdown")
```

**Edit a document:**
```
pdf_edit(
  input_path="/absolute/path/to/report.pdf",
  output_path="/absolute/path/to/report_v2.pdf",
  ops=[
    {"op": "add_watermark", "text": "DRAFT"},
    {"op": "add_page_numbers"}
  ]
)
```

**Validate output:**
```
pdf_lint(input_path="/absolute/path/to/report.pdf")
```

**Critical rule: every path argument must be absolute.** Same reasoning as docx-toolkit — the server has no meaningful "current directory" of its own.

## 3. Using the CLI scripts (fallback)

```bash
python3 scripts/create_pdf.py --spec spec.json --out output.pdf
python3 scripts/read_pdf.py output.pdf --format markdown
python3 scripts/edit_pdf.py output.pdf --out edited.pdf --ops ops.json
python3 scripts/lint_pdf.py output.pdf
```

Relative paths here resolve against your shell's current directory as normal.

## 4. Create spec format

```json
{
  "pageSize": "letter",
  "orientation": "portrait",
  "margins": { "top": 1, "bottom": 1, "left": 1, "right": 1 },
  "defaultFontSize": 11,
  "headingFont": "Helvetica",
  "headingColor": "1F4E79",
  "metadata": { "title": "Q3 Report", "author": "...", "subject": "..." },
  "header": "Confidential",
  "footer": "Page footer",
  "sections": [ ]
}
```

`pageSize`: `"letter"` (default) or `"a4"`. `orientation`: `"portrait"` (default) or `"landscape"`. `margins` in inches. `headingColor` defaults to navy (`1F4E79`), sized 20/16/13/12pt for H1-H4.

### Section types

| `type` | Fields | Notes |
|---|---|---|
| `heading` | `level` (1-4), `text` | |
| `paragraph` | `text` OR `runs: [{text, bold, italic, underline, color, highlight, link}]`, `align`, `indent: {left, right, firstLine}` (inches), `spacing: {before, after}` (pt) | A run with `link` becomes a real clickable hyperlink annotation, not just colored text |
| `bulletList` / `numberedList` | `items` | Uses a plain ASCII prefix (`-` / `1.`), not a Unicode bullet glyph -- see §8 for why |
| `table` | `columnWidths` (pt), `rows` (first row = header unless `header: false`), `headerColor` | |
| `image` | `path`, `width`, `height` (px) | Relative `path` resolves against the spec file's own directory |
| `pageBreak` | -- | |
| `spacer` | `height` (pt) | |

Colors are hex strings without `#`. `highlight` has no true background-color equivalent in the underlying PDF library and is approximated with a distinct foreground color (see §8).

## 5. Read output format

`markdown` includes per-page text and tables, plus a list of hyperlink URLs with their page number. `json` returns `{ metadata, pages: [{page, text, tables}], hyperlinks }`.

## 6. Edit operations (11 total)

Full argument reference: `pdf_help(topic="edit_ops")`. All page indices are 0-based. Operations run in the order given:

`merge`, `extract_pages`, `delete_pages`, `rotate_pages`, `reorder_pages`, `insert_blank_page`, `add_watermark`, `add_page_numbers`, `set_metadata`, `encrypt`, `decrypt`.

## 7. Verify output

```
pdf_lint(input_path="/absolute/path/to/report.pdf")
```
Checks page count consistency, per-page readability, and (if `qpdf` is installed) runs `qpdf --check` — a real independent structural validator, not just "did pypdf not raise an exception." Both `pdf_create` and `pdf_edit` already re-open their own output with `pypdf` before returning, which catches most structural corruption.

## 8. Known gotchas and bugs found during development

- **Unicode bullet characters don't survive text extraction.** reportlab's base-14 fonts don't reliably embed a `ToUnicode` CMap for the standard bullet glyph (`\u2022`) — it renders correctly visually but extracts as an unmapped `(cid:127)` via `pdfplumber` (and would via most other extractors). Fixed by using a plain ASCII `-` prefix instead, confirmed clean under both `pdftotext` and `pdfplumber`.
- **`edit_pdf.py`'s op functions return a `PdfWriter`, not mutate one in place.** An earlier version tried resetting a shared `PdfWriter`'s internal state between chained operations (`writer.__init__()` again) — this happened to work but relies on undocumented internals that could break on a future `pypdf` version. Rewritten so each op takes the current `PdfReader` and returns a fresh `PdfWriter`; the main loop serializes and reopens between ops.
- **A "copy pages into one final writer" step silently dropped metadata.** An intermediate version added a final re-wrap step in `main()` that copied pages via `add_page()` into one last `PdfWriter` before writing to disk -- `add_page()` only copies page content, not the document-level `/Info` dictionary, so `set_metadata` appeared to silently do nothing. Found by actually checking `title`/`author` after the op, not by assuming the copy was lossless. Fixed by writing the last operation's writer directly, with no extra copy step.
- **`qpdf --check` needs the password passed explicitly** (`--password=...`) for an encrypted file — omitting it makes `qpdf` report "invalid password" even when the file is legitimately protected and the correct password was given to `pdf_lint`/`pdf_edit` separately.
- **`highlight` on a paragraph run has no true equivalent in reportlab.** There's no native "background color behind this text" markup tag in reportlab's paragraph mini-XML the way there is in `python-docx`. Approximated with a distinct foreground color, and documented as an approximation rather than silently pretending it's the same thing.

## 9. Explicitly out of scope

Fillable form field creation/filling, digital signatures, OCR/scanned-text recognition, PDF/A conformance conversion, true redaction (content removal, not just visual covering), embedded video/audio/3D objects, JavaScript actions, bookmark/outline tree editing, non-overlay annotations (sticky notes, highlights, freeform drawing), linearization optimization, color space/ICC profile conversion. Also available via `pdf_help(topic="out_of_scope")`.

## 10. File layout

```
pdf-toolkit/
├── .gakrcli-plugin/
│   └── plugin.json
├── .mcp.json
├── README.md
├── USAGE.md
├── MCP.md
├── LICENSE
├── package.json
├── requirements.txt
├── setup.sh
├── server.js
├── help-content.js
├── bin/
│   └── bootstrap.js
├── test-output/
├── scripts/
│   ├── create_pdf.py
│   ├── read_pdf.py
│   ├── edit_pdf.py
│   └── lint_pdf.py
└── skills/
    └── pdf-toolkit/
        └── SKILL.md
```
