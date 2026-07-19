# pdf-toolkit MCP server

Exposes `pdf_create`, `pdf_read`, `pdf_edit`, `pdf_lint`, and `pdf_help` as MCP tools, callable with structured arguments from **any working directory**.

## Why this exists

Same rationale as docx-toolkit: a plain CLI script requires the caller to know its location and resolve paths relative to it. An MCP tool call carries everything the server needs as structured arguments instead.

## As a GAKRCLI plugin (automatic)

`.mcp.json` registers the server using `${GAKR_PLUGIN_ROOT}`:

```json
{
  "mcpServers": {
    "pdf-toolkit": {
      "command": "npm",
      "args": ["run", "--prefix", "${GAKR_PLUGIN_ROOT}", "--silent", "start"]
    }
  }
}
```

The `start` script (`package.json` → `bin/bootstrap.js`) installs Node and Python dependencies automatically on first launch, then starts `server.js` in the same process.

## Manual setup (standalone / non-plugin use)

```bash
npm install
bash setup.sh
```

## Requirements

Python 3.9+ with `pypdf`, `pdfplumber`, `reportlab`. All four tools shell out to Python — there's no in-process Node path here (unlike docx-toolkit's `docx_create`), since Python's PDF libraries are the natural fit for creation as well as reading/editing.

## Registering with a non-GAKRCLI MCP client

```json
{
  "mcpServers": {
    "pdf-toolkit": {
      "command": "node",
      "args": ["/absolute/path/to/pdf-toolkit/server.js"]
    }
  }
}
```

## Critical: all file paths must be absolute

Every path argument (`output_path`, `input_path`, `extract_images_dir`) must be absolute. Relative paths return a clear tool error.

## Tools

| Tool | Purpose | Required args |
|---|---|---|
| `pdf_create` | Build a new .pdf from a spec | `spec`, `output_path` |
| `pdf_read` | Extract content as markdown/JSON | `input_path` |
| `pdf_edit` | Apply one or more edit operations | `input_path`, `output_path`, `ops` |
| `pdf_lint` | Structural sanity check | `input_path` |
| `pdf_help` | Reference for all tools/operations | none required; optional `topic` |

## Architecture notes

- Every tool shells out to a Python script via `child_process`, using absolute paths built from this server's own `__dirname` -- never `process.cwd()`.
- `bin/bootstrap.js` requires `server.js` directly (not spawning it as a child process) so stdio passes through untouched to the MCP client -- same pattern as docx-toolkit, and the same reasoning: spawning would need careful stdio inheritance to avoid breaking the JSON-RPC transport.
- `pdf_edit`'s underlying script (`edit_pdf.py`) chains operations by having each one return a fresh `PdfWriter` rather than mutating one in place -- see `SKILL.md` §8 for the bug this avoided (a shared-writer-reset approach worked but relied on undocumented `pypdf` internals).

## Testing

Validated by:
1. Every Python script tested individually against real output -- not just "did it run without error," but checking actual PDF content (extracted text, page counts, metadata fields, rotation flags, hyperlink annotations) after each operation.
2. `pdf_lint` verified against both valid files (passes) and an intentionally corrupted file (correctly fails with diagnostic detail from `qpdf --check`).
3. The full MCP server tested via the real `@modelcontextprotocol/sdk` client over stdio JSON-RPC, launched from a directory other than the plugin's own.
4. Two real bugs found and fixed during this process (not assumed away): a Unicode bullet character that looked fine visually but didn't survive `pdfplumber` text extraction, and a metadata-dropping bug from an unnecessary final "re-wrap pages into one more writer" step in the editing chain.
