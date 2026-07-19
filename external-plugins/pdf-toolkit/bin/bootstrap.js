#!/usr/bin/env node
/**
 * bin/bootstrap.js
 *
 * Entry point invoked by .mcp.json (via `npm run start`). Ensures both the
 * Node and Python dependencies this plugin needs are present before
 * starting the MCP server -- mirrors docx-toolkit's bootstrap pattern.
 *
 * Runs server.js in the SAME process (via require, not a spawned child) so
 * stdio stays exactly what the MCP client expects.
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");

function hasModule(name) {
  // Check for the package's own package.json rather than
  // require.resolve(name, {paths:[ROOT]}) -- the latter fails for packages
  // whose package.json "exports" map has no root "." entry (only subpath
  // exports), such as @modelcontextprotocol/sdk, even when correctly
  // installed. This exact bug was found and fixed in docx-toolkit's
  // bootstrap script; applying the same fix here from the start.
  return fs.existsSync(path.join(ROOT, "node_modules", name, "package.json"));
}

const REQUIRED_NODE_MODULES = ["@modelcontextprotocol/sdk", "zod"];
const missingNode = REQUIRED_NODE_MODULES.filter((m) => !hasModule(m));

if (missingNode.length > 0) {
  process.stderr.write(`[pdf-toolkit] installing Node dependencies (${missingNode.join(", ")})...\n`);
  try {
    execSync("npm install --no-audit --no-fund", { cwd: ROOT, stdio: "inherit" });
  } catch (err) {
    process.stderr.write(`[pdf-toolkit] npm install failed: ${err.message}\n`);
    process.stderr.write("[pdf-toolkit] the server cannot start without these -- try running 'npm install' manually in the plugin directory.\n");
  }
}

const REQUIRED_PYTHON_MODULES = ["pypdf", "pdfplumber", "reportlab"];

function hasPythonModule(name) {
  try {
    execSync(`python3 -c "import ${name}"`, { cwd: ROOT, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const missingPython = REQUIRED_PYTHON_MODULES.filter((m) => !hasPythonModule(m));
if (missingPython.length > 0) {
  process.stderr.write(`[pdf-toolkit] installing Python dependencies (${missingPython.join(", ")})...\n`);
  let installed = false;
  for (const cmd of [
    `pip install ${missingPython.join(" ")} --quiet --break-system-packages`,
    `pip install ${missingPython.join(" ")} --quiet`,
    `pip3 install ${missingPython.join(" ")} --quiet --break-system-packages`,
    `pip3 install ${missingPython.join(" ")} --quiet`,
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
      `[pdf-toolkit] could not auto-install ${missingPython.join(", ")}. ` +
      `Run: pip install ${missingPython.join(" ")}\n`
    );
  }
}

require(path.join(ROOT, "server.js"));
