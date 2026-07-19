#!/usr/bin/env node
/**
 * bin/bootstrap.js
 *
 * Entry point invoked by .mcp.json (via `npm run start`). Ensures both the
 * Node and Python dependencies this plugin needs are actually present
 * before starting the MCP server -- so a fresh plugin install works without
 * a separate manual setup step, the same way other GAKRCLI plugins
 * (e.g. the telegram channel) run `bun install` as part of their own
 * start script.
 *
 * Runs in the SAME process as server.js (via require, not a spawned child)
 * so stdio stays exactly what the MCP client expects -- spawning server.js
 * as a subprocess here would require careful stdio inheritance to avoid
 * breaking the JSON-RPC stdio transport; requiring it directly avoids that
 * risk entirely.
 */

const { execSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const fs = require("fs");

function hasModule(name) {
  // Not require.resolve(name, {paths:[ROOT]}) -- that fails for packages
  // whose package.json "exports" map has no root "." entry (only subpath
  // exports), such as @modelcontextprotocol/sdk, even when correctly
  // installed. Checking for the package's own package.json is reliable
  // regardless of its exports map shape.
  return fs.existsSync(path.join(ROOT, "node_modules", name, "package.json"));
}

const REQUIRED_NODE_MODULES = ["@modelcontextprotocol/sdk", "docx", "jszip", "zod"];
const missingNode = REQUIRED_NODE_MODULES.filter((m) => !hasModule(m));

if (missingNode.length > 0) {
  process.stderr.write(`[docx-toolkit] installing Node dependencies (${missingNode.join(", ")})...\n`);
  try {
    execSync("npm install --no-audit --no-fund", { cwd: ROOT, stdio: "inherit" });
  } catch (err) {
    process.stderr.write(`[docx-toolkit] npm install failed: ${err.message}\n`);
    process.stderr.write("[docx-toolkit] docx_create will not work until this is resolved. Try running 'npm install' manually in the plugin directory.\n");
  }
}

// Python dependency is optional at this layer -- docx_create runs entirely
// in Node and doesn't need it. Only docx_read/docx_edit/docx_lint shell out
// to Python. Check and attempt install, but don't block server startup over
// it -- a partially-working server (create works, read/edit don't yet) is
// more useful than none at all, and the error from those specific tools will
// be clear if this step didn't succeed.
try {
  execSync('python3 -c "import docx"', { cwd: ROOT, stdio: "ignore" });
} catch {
  process.stderr.write("[docx-toolkit] python-docx not found -- attempting install (needed for docx_read/docx_edit/docx_lint)...\n");
  let installed = false;
  for (const cmd of [
    "pip install python-docx --quiet --break-system-packages",
    "pip install python-docx --quiet",
    "pip3 install python-docx --quiet --break-system-packages",
    "pip3 install python-docx --quiet",
  ]) {
    try {
      execSync(cmd, { cwd: ROOT, stdio: "ignore" });
      installed = true;
      break;
    } catch {
      // try next
    }
  }
  if (!installed) {
    process.stderr.write(
      "[docx-toolkit] could not auto-install python-docx. docx_create still works; " +
      "docx_read/docx_edit/docx_lint need it -- run 'pip install python-docx' manually.\n"
    );
  }
}

require(path.join(ROOT, "server.js"));
