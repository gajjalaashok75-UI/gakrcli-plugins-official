# pdf-toolkit

Create, read, and edit PDF documents from GAKRCLI — headings, formatting, tables, images, hyperlinks, headers/footers, page setup, merging, splitting, rotating, watermarks, page numbers, and encryption.

## What this is

An MCP server exposing five tools — `pdf_create`, `pdf_read`, `pdf_edit`, `pdf_lint`, `pdf_help` — plus a CLI script fallback for manual/standalone use. See `MCP.md` for MCP server details and `USAGE.md` for a full example of every operation.

## Installation

```
/plugin install pdf-toolkit@gakrcli-plugins-official
/reload-plugins
```

The MCP server registers automatically via `.mcp.json`. First launch installs its own Node dependencies and attempts to install the Python dependencies (`pypdf`, `pdfplumber`, `reportlab`) automatically. If the automatic install doesn't work in your environment, run:

```bash
pip install pypdf pdfplumber reportlab
```

or the full manual setup:

```bash
bash setup.sh
```

`qpdf` is optional (used only by `pdf_lint`'s independent structural check) — install it via your system package manager (`apt install qpdf`, `brew install qpdf`, etc.) if you want that extra check.

After installing or updating the plugin inside an already-running session:

```
/reload-plugins
/mcp
```

`/mcp` should show `pdf-toolkit` as connected.

## Usage

```
pdf_create(spec={...}, output_path="/absolute/path/to/report.pdf")
pdf_read(input_path="/absolute/path/to/report.pdf", format="markdown")
pdf_edit(input_path="/absolute/path/to/report.pdf", output_path="/absolute/path/to/output.pdf", ops=[...])
pdf_lint(input_path="/absolute/path/to/output.pdf")
pdf_help()
```

**Every path argument must be absolute.** Same reasoning as docx-toolkit — the server has no meaningful "current directory" of its own.

Call `pdf_help()` any time for a quick index of tools and topics. See `USAGE.md` for a complete worked example of every section type and every edit operation.

## Plugin structure

```
pdf-toolkit/
├── .gakrcli-plugin/plugin.json   # MANDATORY: plugin metadata
├── .mcp.json                      # MCP server registration
├── README.md                      # MANDATORY: this file
├── LICENSE                        # MANDATORY: license file
├── USAGE.md                       # Full usage examples (MCP + CLI form)
├── MCP.md                         # MCP server setup, architecture
├── package.json                   # Node dependencies + self-installing start script
├── requirements.txt                # Python dependencies
├── setup.sh                        # Manual setup fallback
├── server.js                       # MCP server entry point
├── help-content.js                  # Reference data served by pdf_help
├── bin/bootstrap.js                 # Dependency check + server launch
├── scripts/                         # CLI fallback scripts (also what the MCP server shells out to)
└── skills/pdf-toolkit/SKILL.md       # Skill description
```

## Relationship to docx-toolkit

Same plugin architecture and conventions as the `docx-toolkit` plugin (MCP-first, absolute paths required, self-installing bootstrap, `_help` reference tool). The main structural difference: docx-toolkit splits work between Node (creation, via `docx`) and Python (reading/editing, via `python-docx`), because each language had a clearly stronger library for its half. PDF creation, reading, AND editing are all naturally Python's strength (`reportlab`, `pypdf`, `pdfplumber`), so this server is a pure Node orchestrator that shells out to Python for every operation rather than doing any of it in-process.

## Troubleshooting

**Tools not appearing?** Run `/reload-plugins`, then `/mcp`.

**A generated PDF looks wrong or won't open?** Run `pdf_lint` on it first. It's not a full ISO 32000 validator, but it catches the structural failure modes most likely to cause real problems, including via `qpdf --check` if that's installed.

## License

MIT — see `LICENSE`.
