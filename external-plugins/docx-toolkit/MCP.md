# docx-toolkit MCP server

Exposes `docx_create`, `docx_read`, `docx_edit`, `docx_lint`, and `docx_help` as MCP tools, so an agent can call them directly with structured arguments from **any working directory** — no need to locate this plugin's scripts on disk or copy them into a project first.

## Why this exists

The plain CLI scripts (`scripts/create_docx.js`, `scripts/read_docx.py`, etc.) require the caller to know their location and invoke them from (or with paths relative to) a specific directory. An MCP tool call instead carries everything the server needs as structured arguments — the server resolves its own script/library locations internally via its own install path, never the caller's shell working directory.

## As a GAKRCLI plugin (automatic)

If installed via `/plugin install docx-toolkit@...`, the `.mcp.json` in this directory registers the server automatically using `${GAKR_PLUGIN_ROOT}` — GAKRCLI substitutes its own resolved install path, so no manual path configuration is needed:

```json
{
  "mcpServers": {
    "docx-toolkit": {
      "command": "npm",
      "args": ["run", "--prefix", "${GAKR_PLUGIN_ROOT}", "--silent", "start"]
    }
  }
}
```

The `start` script (`package.json` → `bin/bootstrap.js`) installs Node dependencies and attempts to install `python-docx` automatically on first launch, then starts `server.js` in the same process (not a spawned child, so stdio stays exactly what the MCP client expects).

## Manual setup (standalone / non-plugin use)

```bash
npm install
bash setup.sh   # also installs python-docx
```

## Requirements

Python 3.9+ with `python-docx>=1.2.0` (`docx_read`/`docx_edit`/`docx_lint` shell out to the Python scripts). `docx_create` runs entirely in-process in Node — no Python needed for that tool specifically.

## Running standalone (for testing)

```bash
node server.js
```
It communicates over stdio using the MCP protocol — this will just sit waiting for JSON-RPC messages on stdin, which is expected. Use an MCP client (see below) or an MCP-aware agent to actually talk to it.

## Registering with a non-GAKRCLI MCP client

### Claude Code / claude.ai desktop config

```json
{
  "mcpServers": {
    "docx-toolkit": {
      "command": "node",
      "args": ["/absolute/path/to/docx-toolkit/server.js"]
    }
  }
}
```

### Generic MCP client (Node)

```javascript
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");

const transport = new StdioClientTransport({
  command: "node",
  args: ["/absolute/path/to/docx-toolkit/server.js"],
});
const client = new Client({ name: "my-agent", version: "1.0.0" });
await client.connect(transport);

const result = await client.callTool({
  name: "docx_create",
  arguments: {
    spec: { sections: [{ type: "heading", level: 1, text: "Hello" }] },
    output_path: "/absolute/path/to/output.docx",
  },
});
```

## Critical: all file paths must be absolute

Every path argument (`output_path`, `input_path`, `extract_images_dir`, `base_path`) **must be absolute**. The server has no single meaningful "current directory" — wherever it happened to be launched from is not the same thing as wherever your actual working files live. Passing a relative path returns a clear tool error rather than silently resolving against the wrong location.

Image paths *inside* a create spec (`{"type": "image", "path": "..."}`) can be relative — they resolve against `base_path` if given, or the output file's own directory otherwise.

## Tools

| Tool | Purpose | Required args |
|---|---|---|
| `docx_create` | Build a new .docx from a spec | `spec`, `output_path` |
| `docx_read` | Extract content as markdown/JSON | `input_path` |
| `docx_edit` | Apply one or more edit operations | `input_path`, `output_path`, `ops` |
| `docx_lint` | Structural sanity check | `input_path` |
| `docx_help` | Reference for all tools/operations, callable mid-task | none required; optional `topic` |

Full spec/ops format: see `USAGE.md` and `skills/docx-toolkit/SKILL.md`. Or just call `docx_help()` for a quick index without leaving your task.

## Architecture notes

- `docx_create` calls `lib/docx_builder.js` **in-process** (no subprocess) — this is the fastest path and the main practical benefit of the MCP approach for document creation.
- `docx_read`/`docx_edit`/`docx_lint` spawn the existing Python scripts via `child_process`, using absolute paths built from this server's own `__dirname` — never `process.cwd()`.
- `bin/bootstrap.js` also requires `server.js` directly (not spawning it as a child process) so stdio passes through untouched to the MCP client.
- Per-call state (e.g. the shape-placeholder workaround in `docx_builder.js`) is scoped inside each function call, not held at module level — this was verified under real concurrent load (5 simultaneous `docx_create` calls, each with distinct shape content, checked pairwise for cross-contamination) since a long-running server can receive overlapping requests, unlike a one-shot CLI process.

## Testing

The server was validated by:
1. Spawning it via the real MCP client SDK (not just import-checking the code) and calling every tool over the actual stdio JSON-RPC protocol, launched from a directory other than the plugin's own.
2. Validating every file it produced against the real ISO/IEC 29500 WordprocessingML XSD schema.
3. Firing 5 concurrent `docx_create` calls with distinct content and confirming no cross-contamination between them.
4. Confirming relative paths are rejected with a clear error rather than silently mis-resolved.
5. Re-running all of the above after the plugin restructure (server.js and lib/ moved to the plugin root) to confirm the path changes didn't break anything.

If you modify `server.js`, `bin/bootstrap.js`, or `lib/docx_builder.js`, re-verify at least (1) and (2) — "the code has no syntax errors" is not evidence it works correctly over the protocol.
