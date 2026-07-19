# docx-toolkit

Create, read, and edit Word (`.docx`) documents from GAKRCLI — headings, formatting, colors, tables, images, hyperlinks, headers/footers, page setup, bookmarks, fields, watermarks, and review comments.

## What this is

An MCP server exposing five tools — `docx_create`, `docx_read`, `docx_edit`, `docx_lint`, `docx_help` — plus a CLI script fallback for manual/standalone use. See `MCP.md` for MCP server details and `USAGE.md` for a full example of every operation.

## Installation

```
/plugin install docx-toolkit@gakrcli-plugins-official
/reload-plugins
```

The MCP server registers automatically via `.mcp.json`. First launch installs its own Node dependencies and attempts to install the Python dependency (`python-docx`) automatically — see `package.json`'s `start` script / `bin/bootstrap.js`. If the automatic Python install doesn't work in your environment, run:

```bash
pip install python-docx
```

or the full manual setup:

```bash
bash setup.sh
```

After installing or updating the plugin inside an already-running session:

```
/reload-plugins
/mcp
```

`/mcp` should show `docx-toolkit` as connected.

## Usage

Call the tools directly once connected:

```
docx_create(spec={...}, output_path="/absolute/path/to/report.docx")
docx_read(input_path="/absolute/path/to/report.docx", format="markdown")
docx_edit(input_path="/absolute/path/to/report.docx", output_path="/absolute/path/to/output.docx", ops=[...])
docx_lint(input_path="/absolute/path/to/output.docx")
docx_help()
```

**Every path argument must be absolute.** The server has no meaningful "current directory" of its own — this is the entire point of using it as an MCP tool instead of a script you have to locate and invoke by hand.

Call `docx_help()` any time for a quick index of tools and topics, or `docx_help(topic="edit_ops")` / `docx_help(topic="create_spec")` for full argument reference without leaving your task.

See `USAGE.md` for a complete worked example of every section type and every edit operation.

## Plugin structure

```
docx-toolkit/
├── .gakrcli-plugin/
│   └── plugin.json     # MANDATORY: plugin metadata
├── .mcp.json             # MCP server registration
├── README.md             # MANDATORY: this file
├── LICENSE               # MANDATORY: license file
├── USAGE.md              # Full usage examples (MCP + CLI form)
├── MCP.md                # MCP server setup, architecture, client registration
├── package.json          # Node dependencies + self-installing start script
├── requirements.txt       # Python dependency
├── setup.sh               # Manual setup fallback
├── server.js              # MCP server entry point
├── help-content.js         # Reference data served by docx_help
├── bin/bootstrap.js        # Dependency check + server launch
├── lib/docx_builder.js     # Core document-creation logic
├── scripts/                # CLI fallback scripts
└── skills/docx-toolkit/SKILL.md   # Skill description (when/how to use this)
```

## Why an MCP server instead of just scripts

A plain script requires the caller to know where it lives on disk and invoke it with correctly-resolved paths. An MCP tool call instead carries everything the server needs as structured arguments — the server resolves its own script/library locations internally from its own install path (via `${GAKR_PLUGIN_ROOT}` in `.mcp.json`), never the caller's shell working directory. See `MCP.md` for the full rationale and how this was verified (including under concurrent load).

## Troubleshooting

**Tools not appearing / `/mcp` doesn't show docx-toolkit connected?**
- Run `/reload-plugins`, then `/mcp`.
- Check `.mcp.json` is present and `GAKR_PLUGIN_ROOT` resolved correctly (GAKRCLI substitutes this automatically).

**`docx_create` works but `docx_read`/`docx_edit`/`docx_lint` fail?**
- These need Python 3.9+ with `python-docx>=1.2.0`. The bootstrap script attempts to install this automatically on first launch; if that failed in your environment, run `pip install python-docx` manually.

**A generated file won't open in Word?**
- Run `docx_lint` on it first. If that passes but Word still rejects the file, see `SKILL.md` §12 — validating against the real ISO/IEC 29500 XSD schema is the only fully authoritative check; `docx_lint` catches known bug classes but isn't a complete validator.

## License

MIT — see `LICENSE`.
