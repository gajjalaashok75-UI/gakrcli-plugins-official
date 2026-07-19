---
name: docx-toolkit
description: "Use this skill any time the agent needs to create a new Word document (.docx), read/extract content from an existing one, or modify/update an existing one — text, formatting, colors, tables, images, hyperlinks, headers/footers, page setup, bookmarks, fields, watermarks, or review comments. Trigger on requests mentioning 'Word document', '.docx', 'report', 'memo', 'letter', 'contract', or any request to generate, summarize, edit, comment on, reformat, or restructure a Word file. Covers create (build a new .docx from a structured spec), read (extract text/headings/tables/links/headers/footers from an existing .docx into markdown/JSON), and edit (apply one or more of ~28 operations to an existing .docx in place). Prefer the MCP server (docx_create/docx_read/docx_edit/docx_lint/docx_help tools) over the CLI scripts when available — it works from any working directory without locating files on disk first."
compatibility: "MCP server: Node.js with @modelcontextprotocol/sdk (see MCP.md). CLI scripts: Node.js (docx, jszip) for creation, Python 3.9+ (python-docx>=1.2.0) for reading/editing. See setup.sh."
---

# docx-toolkit

Creates, reads, and edits `.docx` Word files. Two ways to use it:

- **MCP server** (`server.js`, registered via `.mcp.json`) — five tools: `docx_create`, `docx_read`, `docx_edit`, `docx_lint`, `docx_help`. Call them directly with structured arguments from any working directory. **This is the preferred way to use this skill** whenever an MCP client is available — no need to locate scripts on disk, resolve relative paths, or know this skill's install location.
- **CLI scripts** (`scripts/*.js`, `scripts/*.py`) — the same operations as direct command-line invocations. Useful as a fallback when no MCP client is available, or for quick manual testing.

Both paths share the exact same underlying logic (`lib/docx_builder.js` for creation; the Python scripts for reading/editing) — there's no behavioral difference between them, only how you invoke them.

## 1. Setup

```bash
bash setup.sh
```
Installs Node dependencies (`docx`, `jszip`, and the MCP server's own dependencies) and the Python dependency (`python-docx`). LibreOffice + poppler are optional, used only for the visual-verification step in §8.

## 2. Using the MCP server (preferred)

This plugin registers itself automatically via `.mcp.json` when installed through GAKRCLI's plugin system -- see `MCP.md` for manual setup, standalone testing, and client-registration examples (Claude Code, generic MCP clients). Once registered, call the tools directly:

**Get oriented — call this first if you're not sure of an argument name:**
```
docx_help()                         → index of all tools and topics
docx_help(topic="edit_ops")         → every edit operation with its arguments
docx_help(topic="create_spec")      → full create-spec section-type reference
docx_help(topic="colors")           → color/highlight value reference
```

**Create a document:**
```
docx_create(
  spec={
    "metadata": {"title": "Quarterly Report", "author": "..."},
    "sections": [
      {"type": "heading", "level": 1, "text": "Overview"},
      {"type": "paragraph", "text": "This report covers Q3 performance."}
    ]
  },
  output_path="/absolute/path/to/report.docx"
)
```

**Read a document:**
```
docx_read(input_path="/absolute/path/to/report.docx", format="markdown")
```

**Edit a document:**
```
docx_edit(
  input_path="/absolute/path/to/report.docx",
  output_path="/absolute/path/to/report_v2.docx",
  ops=[
    {"op": "find_replace", "find": "Draft", "replace": "Final"},
    {"op": "add_comment", "anchor": "Q3 performance", "text": "Confirm figures.", "author": "Reviewer"}
  ]
)
```

**Validate output:**
```
docx_lint(input_path="/absolute/path/to/report.docx")
```

**Critical rule: every path argument must be absolute.** The server has no meaningful "current directory" of its own — pass full paths (`/home/user/project/report.docx`), not relative ones. Relative paths return a clear tool error rather than resolving against the wrong location. This is the entire reason the MCP server exists: eliminating exactly this class of "where are the scripts / what's my working directory" problem.

The spec format for `docx_create` and the full operation list for `docx_edit` are identical to what's documented in §4-§5 below — those sections describe the *data format*, which is the same whether you're filling out a CLI `--spec spec.json` file or passing the same object directly as the `spec` MCP argument.

## 3. Using the CLI scripts (fallback)

```bash
node scripts/create_docx.js --spec spec.json --out output.docx
python3 scripts/read_docx.py output.docx --format markdown
python3 scripts/edit_docx.py output.docx --out edited.docx --ops ops.json
python3 scripts/lint_docx.py output.docx
```

Relative paths here resolve against your shell's current directory as normal — the "must be absolute" rule is specific to the MCP server, which has no shell/cwd context of its own.

## 4. Create spec format

```json
{
  "title": "Quarterly Report",
  "pageSize": "letter",
  "orientation": "portrait",
  "margins": { "top": 1, "bottom": 1, "left": 1, "right": 1 },
  "defaultFont": "Calibri",
  "defaultFontSize": 11,
  "headingFont": "Calibri",
  "headingColor": "1F4E79",
  "metadata": { "title": "Q3 Report", "author": "...", "subject": "...", "keywords": "...", "category": "...", "description": "...", "lastModifiedBy": "..." },
  "header": "Confidential",
  "footer": { "text": "Page footer", "align": "center" },
  "firstPageHeader": "Cover Page",
  "sections": [ ]
}
```

`pageSize`: `"letter"` (default) or `"a4"`. `orientation`: `"portrait"` (default) or `"landscape"` (auto-swaps page dimensions). `margins` in inches.

`defaultFont`/`defaultFontSize`/`headingFont`/`headingColor` control document-wide styling (see §11 — without these, Word falls back to Times New Roman with no real heading hierarchy, since the underlying `docx` library sets no defaults of its own). Defaults: Calibri, 11pt body, navy (`1F4E79`) headings sized 20/16/13/12pt (H1-H4) with proper spacing — a reasonable professional baseline, override for a different look.

### Section types

| `type` | Fields | Notes |
|---|---|---|
| `heading` | `level` (1-4), `text` | |
| `paragraph` | `text` OR `runs: [{text, bold, italic, underline, color, highlight, link}]`, `align`, `indent: {left, right, firstLine, hanging}` (inches), `spacing: {before, after}` (pt), `keepWithNext`, `pageBreakBefore` | A run with `link` becomes a hyperlink |
| `bulletList` / `numberedList` | `items`, `format` (`bullet`, `decimal`, `upperRoman`, `lowerRoman`, `upperLetter`, `lowerLetter`) | |
| `table` | `columnWidths`, `rows` (first row = header unless `header: false`), `headerColor`, `cellColors` (map `"row,col"` to hex), `cellVerticalAlign` (`top`/`center`/`bottom`), `borders` (`false` to omit) | |
| `image` | `path`, `width`, `height` (px) | Relative `path` resolves against `base_path` (MCP) or the CLI's working directory |
| `shape` | `text`, `width`, `height`, `bold` | Simple rectangular text box |
| `pageBreak` | -- | |

Colors are hex strings without `#` (e.g. `"FF0000"`). `highlight` values match Word's highlight palette (`yellow`, `green`, `cyan`, `magenta`, `red`, `blue`, `darkGray`, etc.) — full list via `docx_help(topic="colors")`.

## 5. Read output format

`markdown` includes header/footer text and a list of hyperlink URLs found. `json` returns `{ paragraphs, headings, tables, headers, footers, hyperlinks, metadata }` — `metadata` holds core document properties (title, author, subject, keywords, category, comments, language, last_modified_by).

## 6. Edit operations (28 total)

Full argument reference: `docx_help(topic="edit_ops")`, or the table in `USAGE.md`. Operations run in the order given, each with an `op` field:

`find_replace`, `append_paragraph`, `append_heading`, `append_table`, `append_image`, `insert_page_break`, `add_comment`, `insert_hyperlink`, `set_header`, `set_footer`, `resize_image`, `remove_page`, `move_page`, `set_metadata`, `format_paragraph`, `add_table_row`, `delete_table_row`, `add_table_column`, `delete_table_column`, `merge_cells`, `set_cell_shading`, `set_table_borders`, `add_bookmark`, `insert_page_number_field`, `insert_toc_field`, `set_orientation`, `set_margins`, `add_watermark`.

## 7. Page move/remove — how "pages" are detected

Word documents don't store discrete page objects — pagination is computed at render time. This toolkit treats **explicit page breaks** (inserted via the `pageBreak` section type or `insert_page_break` op) as page boundaries, and groups the content between them into a "page" for `remove_page`/`move_page`. It will not detect pages that only exist because content overflowed onto a new page in Word's live layout — only breaks your spec or edits explicitly created.

## 8. Cross-library compatibility notes

Files created via `docx_create` (docx-js under the hood) and files edited via `docx_edit` (python-docx under the hood) don't always define the same named styles internally:
- `append_heading` checks for a matching "Heading N" style before using it, falling back to manually bold/sized text if absent — otherwise python-docx would insert a duplicate paragraph on failure.
- `set_table_borders` similarly no-ops gracefully if "Table Grid" isn't defined, rather than crashing.
- Highlight color XML values are case-insensitive between the two libraries (`yellow` vs `YELLOW`) — both render correctly in Word.

## 9. Verify output

```
docx_lint(input_path="/absolute/path/to/report.docx")
```
or `python3 scripts/lint_docx.py report.docx` via CLI. Catches the specific structural bug classes documented in §12 — paragraph/pPr ordering, table-cell property sequence, missing `gridCol` width, duplicate shading, section-properties placement, bookmark balance. **Not a full XSD validator** — both `docx_create` and `docx_edit` already re-open their own output with `python-docx` before returning, which catches most structural corruption, but the only fully authoritative check is validating against the real ISO/IEC 29500 WordprocessingML XSD schema (§12 explains why and how this was actually done during development).

Optional visual check if LibreOffice is installed:
```bash
soffice --headless --convert-to pdf output.docx
pdftoppm -jpeg -r 100 output.pdf page
```

## 10. Known gotchas

- Word splits sentences across multiple `<w:r>` runs — always match against a paragraph's combined `.text`, never assume a phrase lives in one run. `find_replace` and `add_comment` handle this by merging runs first.
- Table column widths must sum to the table's declared width, and each cell needs its own width.
- Default page size is A4 in most docx libraries — set `"pageSize": "letter"` explicitly if the recipient expects US Letter.
- Field codes (`PAGE`, `NUMPAGES`, `TOC`) are definitions, not baked-in values — Word computes and displays them on open (or F9). They'll show as empty in tools that don't evaluate fields (e.g. `docx_read`'s plain-text dump).
- After `merge_cells`, `docx_read`'s table extraction shows the merged cell's text at every grid position it spans (a `python-docx` quirk when iterating cells naively across a merged span) — the underlying document is correct and displays properly in Word; only the plain-text/markdown dump looks duplicated.

## 11. Why output looked unprofessional before (font defaults)

The `docx` npm library sets **no document-wide defaults at all** by default — its `docDefaults` block is emitted completely empty (`<w:rPrDefault/><w:pPrDefault/>`), and its built-in Heading 1-4 styles only vary by color and a modest size bump, not a real hierarchy. With nothing specified, Word falls back to its own hardcoded application default (Times New Roman), which is why documents could come out looking inconsistent or dated even though nothing was structurally wrong with them.

`docx_create` now explicitly sets:
- Body text: Calibri 11pt, 8pt paragraph spacing, ~1.08 line spacing (matches modern Word's own defaults)
- Headings 1-4: Calibri, navy (`#1F4E79`), sized 20/16/13/12pt with proper before/after spacing and outline levels (so an inserted Table of Contents field actually has something to list)
- Hyperlink style: standard blue/underlined

All overridable per-document via `defaultFont`, `defaultFontSize`, `headingFont`, `headingColor` in the spec (§4).

## 12. Bugs found via real Microsoft Word and direct XSD validation

python-docx and LibreOffice both parse OOXML leniently — they will happily open files that violate rules real Microsoft Word enforces strictly. Several such bugs were found this way (confirmed by validating output directly against the ISO/IEC 29500 WordprocessingML XSD schema, not just re-opening with the same lenient tools that missed them) and fixed:

- **`add_bookmark`** inserted `<w:bookmarkStart>` as the unconditional first child of `<w:p>`. `<w:pPr>` must be first when present. Fixed to insert after `pPr`.
- **`add_table_column`** created `<w:gridCol>` without the required `w:w` width attribute — the `width` parameter was computed but never written. Fixed; `width` is now respected (DXA units).
- **`set_cell_shading`** appended a new `<w:shd>` without checking whether the cell already had one (e.g. a header cell shaded at creation time) — `CT_TcPr` only permits one `shd` child. Fixed to remove any existing one first.
- **`highlight` values were uppercase** (`"YELLOW"`) in the creation path — the OOXML enumeration requires lowercase (`"yellow"`). Fixed to resolve through docx-js's own `HighlightColor` enum so any input casing normalizes correctly.
- **docx-js's `Textbox` class itself emits invalid XML**: `<w:pict>` as a direct child of `<w:p>` (must be wrapped in `<w:r>`), plus a duplicated/misplaced `<w:p>`. This is a defect in the `docx` npm package's own Textbox implementation, not fixable by calling its API differently. Worked around by not using `Textbox` at all — a plain-text placeholder run is swapped for hand-built, schema-validated raw XML in a post-processing step.
- **docx-js also emits a nonexistent `<w:highlightCs>` element** whenever `highlight` is set on a run — this element does not appear anywhere in the real ISO/IEC 29500 schema. Suppressed via docx-js's `highlightComplexScript: false` option.
- **`lint_docx.py` used ✅/❌ characters in printed output**, which crash with `UnicodeEncodeError` on Windows when stdout is piped through a non-UTF-8 console encoding. Fixed to use `[OK]`/`[FAIL]` ASCII markers instead. (Found via independent testing on Windows.)
- **`read_docx.py`'s JSON output was missing document metadata** (title, author, subject, keywords, etc.) even though `set_metadata` exists on the edit side — an asymmetry. Fixed: `json` format now includes a `metadata` object. (Also found via independent testing.)

### How the schema-validation bugs were actually found

Re-opening output with `python-docx` or converting with LibreOffice was not sufficient to catch most of the above — those files opened "successfully" in both. They were only caught by validating `word/document.xml` (and other parts) directly against the real WordprocessingML XSD schema, which enforces element ordering, cardinality, and enumeration value casing that lenient parsers silently repair or ignore. If modifying the raw-OXML operations (`add_bookmark`, `add_table_column`, `set_cell_shading`, `add_watermark`, `insert_hyperlink`, field-code insertion, the shape/Textbox workaround) in the future, validate against a real XSD schema before trusting the result — "python-docx can re-open it" is not evidence the file is valid.

## 13. Explicitly out of scope

Not implemented — either because `python-docx`/`docx-js` have no reliable API for them and hand-rolling the OOXML would be substantial, unverified surface area, or because they're not something a script should safely automate:

VBA macros, OLE-embedded Excel/PowerPoint/PDF objects, digital signatures, SmartArt, native charts, equations, mail-merge execution, full document comparison/co-authoring metadata, image effects (shadow, glow, 3D, crop, rotate, flip, wrap-through), QR/barcodes, content-control form fields (checkboxes, dropdowns, date pickers), footnotes/endnotes, and track-changes accept/reject. Also available via `docx_help(topic="out_of_scope")`.

## 14. File layout

This is a GAKRCLI plugin -- see `README.md` for install instructions.

```
docx-toolkit/
├── .gakrcli-plugin/
│   └── plugin.json       -- plugin metadata (name, description, author, keywords)
├── .mcp.json               -- registers the MCP server via GAKR_PLUGIN_ROOT
├── README.md               -- plugin overview and install instructions
├── USAGE.md                -- copy-pasteable examples for every operation, both MCP and CLI form
├── MCP.md                  -- MCP server details: manual setup, client registration, architecture notes
├── LICENSE
├── package.json            -- Node dependencies + self-installing 'start' script
├── requirements.txt         -- Python dependency (python-docx)
├── setup.sh                 -- manual setup fallback (the plugin normally self-installs on first launch)
├── server.js                -- MCP server: registers docx_create/read/edit/lint/help tools
├── help-content.js          -- structured reference data served by docx_help
├── bin/
│   └── bootstrap.js         -- ensures dependencies are installed, then starts server.js
├── lib/
│   └── docx_builder.js      -- core creation logic, shared by the CLI and the MCP server
├── test-output/             -- known-good example .docx files, generated via the MCP server itself and XSD-validated
├── scripts/                  -- CLI fallback (see §3)
│   ├── create_docx.js         -- thin wrapper around lib/docx_builder.js
│   ├── read_docx.py
│   ├── edit_docx.py
│   └── lint_docx.py          -- structural sanity checks (not a full XSD validator)
└── skills/
    └── docx-toolkit/
        └── SKILL.md          -- this file
```
