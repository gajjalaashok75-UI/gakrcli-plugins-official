#!/usr/bin/env node
/**
 * docx-toolkit MCP server.
 *
 * Exposes docx_create / docx_read / docx_edit / docx_lint as MCP tools so an
 * agent can call them directly -- with structured arguments -- from ANY
 * working directory, instead of needing to locate this skill's scripts on
 * disk (or copy them into its own project) before it can use them.
 *
 * Design decisions that matter for correctness:
 *
 * - All file path arguments (docx paths, image paths inside a create spec)
 *   MUST be absolute. A long-running server process has no single meaningful
 *   "current directory" of its own -- the directory it happened to be
 *   launched from is not the same thing as wherever the calling agent's
 *   actual working files live. Relative paths are rejected with a clear
 *   error rather than silently resolved against the wrong place.
 *
 * - docx_create calls lib/docx_builder.js directly, in-process (no
 *   subprocess, no temp files for the spec itself) -- this is the biggest
 *   practical win of the MCP approach for creation.
 *
 * - docx_read / docx_edit / docx_lint shell out to the existing, already
 *   validated Python scripts via absolute paths derived from this server's
 *   own __dirname, never from process.cwd() -- so it works the same
 *   regardless of where the server was launched from.
 */

const path = require("path");
const fs = require("fs");
const os = require("os");
const { spawn } = require("child_process");
const { randomUUID } = require("crypto");
const { z } = require("zod");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

const { buildDocxBuffer } = require("./lib/docx_builder");
const { TOPICS } = require("./help-content");

const SKILL_ROOT = __dirname;
const SCRIPTS_DIR = path.join(SKILL_ROOT, "scripts");

function requireAbsolute(p, argName) {
  if (!p || typeof p !== "string" || !path.isAbsolute(p)) {
    throw new Error(
      `${argName} must be an absolute path (got ${JSON.stringify(p)}). ` +
      `This server has no meaningful "current directory" of its own -- pass ` +
      `the full path, e.g. "/home/user/project/report.docx".`
    );
  }
}

function runPython(scriptName, args) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(SCRIPTS_DIR, scriptName);
    const proc = spawn("python3", [scriptPath, ...args], { cwd: SKILL_ROOT });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`${scriptName} exited ${code}: ${stderr || stdout}`));
      } else {
        resolve({ stdout, stderr });
      }
    });
    proc.on("error", (err) => reject(err));
  });
}

function writeTempJson(obj) {
  const tmpPath = path.join(os.tmpdir(), `docx-toolkit-${randomUUID()}.json`);
  fs.writeFileSync(tmpPath, JSON.stringify(obj));
  return tmpPath;
}

const server = new McpServer({ name: "docx-toolkit", version: "1.0.0" });

// ---- docx_create ----
server.registerTool(
  "docx_create",
  {
    title: "Create a Word document",
    description:
      "Creates a new .docx file from a structured JSON spec (headings, paragraphs, " +
      "lists, tables, images, shapes, headers/footers, page setup, metadata). " +
      "See the docx_help tool (topic: 'create_spec') for the full spec format and examples. " +
      "output_path must be absolute.",
    inputSchema: {
      spec: z.record(z.any()).describe("The document spec object -- call docx_help with topic:'create_spec' for the full format"),
      output_path: z.string().describe("Absolute path to write the .docx file to"),
      base_path: z.string().optional().describe(
        "Absolute directory that relative image/shape paths inside the spec resolve " +
        "against. Defaults to output_path's directory if not given."
      ),
    },
  },
  async ({ spec, output_path, base_path }) => {
    requireAbsolute(output_path, "output_path");
    const resolvedBase = base_path
      ? (requireAbsolute(base_path, "base_path"), base_path)
      : path.dirname(output_path);

    const buffer = await buildDocxBuffer(spec, resolvedBase);
    fs.mkdirSync(path.dirname(output_path), { recursive: true });
    fs.writeFileSync(output_path, buffer);

    const stat = fs.statSync(output_path);
    if (stat.size < 100) {
      throw new Error("Output file suspiciously small -- generation likely failed");
    }

    return {
      content: [
        { type: "text", text: `Created ${output_path} (${stat.size} bytes)` },
      ],
    };
  }
);

// ---- docx_read ----
server.registerTool(
  "docx_read",
  {
    title: "Read a Word document",
    description:
      "Extracts content from an existing .docx as markdown or structured JSON " +
      "(paragraphs, headings, tables, headers, footers, hyperlinks). Can also " +
      "extract embedded images to a directory. input_path must be absolute.",
    inputSchema: {
      input_path: z.string().describe("Absolute path to the .docx file to read"),
      format: z.enum(["markdown", "json"]).default("markdown"),
      extract_images_dir: z.string().optional().describe(
        "Absolute directory to extract embedded images into, if desired"
      ),
    },
  },
  async ({ input_path, format, extract_images_dir }) => {
    requireAbsolute(input_path, "input_path");
    const args = [input_path, "--format", format];
    if (extract_images_dir) {
      requireAbsolute(extract_images_dir, "extract_images_dir");
      fs.mkdirSync(extract_images_dir, { recursive: true });
      args.push("--extract-images", extract_images_dir);
    }
    const { stdout } = await runPython("read_docx.py", args);
    return { content: [{ type: "text", text: stdout }] };
  }
);

// ---- docx_edit ----
server.registerTool(
  "docx_edit",
  {
    title: "Edit a Word document",
    description:
      "Applies one or more operations to an existing .docx and writes a new file. " +
      "Supports ~25 operations: find_replace, append_paragraph/heading/table/image, " +
      "insert_page_break, add_comment, insert_hyperlink, set_header/footer, " +
      "resize_image, remove_page/move_page, set_metadata, format_paragraph, table " +
      "row/column/cell operations, add_bookmark, page-number/TOC fields, " +
      "set_orientation/margins, add_watermark. Call docx_help with topic:'edit_ops' for the full " +
      "list with examples. input_path and output_path must be absolute.",
    inputSchema: {
      input_path: z.string().describe("Absolute path to the source .docx file"),
      output_path: z.string().describe("Absolute path to write the edited .docx file"),
      ops: z.array(z.record(z.any())).describe(
        "Array of operation objects, each with an 'op' field. Call docx_help with topic:'edit_ops' for the full list."
      ),
    },
  },
  async ({ input_path, output_path, ops }) => {
    requireAbsolute(input_path, "input_path");
    requireAbsolute(output_path, "output_path");
    const opsPath = writeTempJson(ops);
    try {
      fs.mkdirSync(path.dirname(output_path), { recursive: true });
      const { stdout, stderr } = await runPython("edit_docx.py", [
        input_path,
        "--out",
        output_path,
        "--ops",
        opsPath,
      ]);
      return { content: [{ type: "text", text: stdout + (stderr ? `\n${stderr}` : "") }] };
    } finally {
      fs.unlinkSync(opsPath);
    }
  }
);

// ---- docx_lint ----
server.registerTool(
  "docx_lint",
  {
    title: "Structurally validate a Word document",
    description:
      "Runs structural sanity checks on a .docx (paragraph/pPr ordering, table-cell " +
      "property sequence, gridCol width, section-properties placement, bookmark " +
      "balance) -- the specific bug classes that python-docx/LibreOffice silently " +
      "tolerate but real Microsoft Word rejects. Not a full XSD validator, but " +
      "catches the known failure modes. input_path must be absolute.",
    inputSchema: {
      input_path: z.string().describe("Absolute path to the .docx file to check"),
    },
  },
  async ({ input_path }) => {
    requireAbsolute(input_path, "input_path");
    const { stdout } = await runPython("lint_docx.py", [input_path]);
    return { content: [{ type: "text", text: stdout }] };
  }
);

// ---- docx_help ----
server.registerTool(
  "docx_help",
  {
    title: "Reference for all docx-toolkit tools and operations",
    description:
      "Returns usage reference for this toolkit -- what each tool does, its " +
      "arguments, the full create-spec section-type format, the full edit " +
      "operations list with argument shapes, color/highlight value reference, " +
      "and what's explicitly out of scope. Call with no arguments for a top-level " +
      "index, or 'topic' to get just that section. Useful mid-task instead of " +
      "guessing an operation's exact argument names.",
    inputSchema: {
      topic: z.enum([
        "overview", "docx_create", "docx_read", "docx_edit", "docx_lint",
        "create_spec", "edit_ops", "colors", "out_of_scope",
      ]).optional().describe(
        "Which section to return. Omit for the full index of available topics."
      ),
    },
  },
  async ({ topic }) => {
    if (!topic) {
      const index = {
        ...TOPICS.overview,
        available_topics: Object.keys(TOPICS),
      };
      return { content: [{ type: "text", text: JSON.stringify(index, null, 2) }] };
    }
    const section = TOPICS[topic];
    if (!section) {
      return {
        isError: true,
        content: [{ type: "text", text: `Unknown topic '${topic}'. Available: ${Object.keys(TOPICS).join(", ")}` }],
      };
    }
    return { content: [{ type: "text", text: JSON.stringify(section, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("docx-toolkit MCP server running on stdio");
}

main().catch((err) => {
  console.error("docx-toolkit MCP server failed to start:", err);
  process.exit(1);
});
