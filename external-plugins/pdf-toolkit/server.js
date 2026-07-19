#!/usr/bin/env node
/**
 * pdf-toolkit MCP server.
 *
 * Exposes pdf_create / pdf_read / pdf_edit / pdf_lint / pdf_help as MCP
 * tools -- same rationale as docx-toolkit's server: an agent calls these
 * with structured arguments from ANY working directory, instead of needing
 * to locate this plugin's scripts on disk first.
 *
 * Unlike docx-toolkit (Node for creation, Python for read/edit), ALL FOUR
 * PDF operations are Python-based here (reportlab for creation, pypdf +
 * pdfplumber for reading/editing) -- Python's PDF libraries are the mature,
 * natural choice for every one of these operations, so this server is a
 * pure orchestrator that shells out to Python scripts for everything,
 * rather than doing any of the work in-process.
 *
 * All file path arguments MUST be absolute -- same rule and same reasoning
 * as docx-toolkit: a long-running server has no single meaningful "current
 * directory" of its own.
 */

const path = require("path");
const fs = require("fs");
const os = require("os");
const { spawn } = require("child_process");
const { randomUUID } = require("crypto");
const { z } = require("zod");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");

const { TOPICS } = require("./help-content");

const SKILL_ROOT = __dirname;
const SCRIPTS_DIR = path.join(SKILL_ROOT, "scripts");

function requireAbsolute(p, argName) {
  if (!p || typeof p !== "string" || !path.isAbsolute(p)) {
    throw new Error(
      `${argName} must be an absolute path (got ${JSON.stringify(p)}). ` +
      `This server has no meaningful "current directory" of its own -- pass ` +
      `the full path, e.g. "/home/user/project/report.pdf".`
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
  const tmpPath = path.join(os.tmpdir(), `pdf-toolkit-${randomUUID()}.json`);
  fs.writeFileSync(tmpPath, JSON.stringify(obj));
  return tmpPath;
}

const server = new McpServer({ name: "pdf-toolkit", version: "1.0.0" });

// ---- pdf_create ----
server.registerTool(
  "pdf_create",
  {
    title: "Create a PDF document",
    description:
      "Creates a new .pdf file from a structured JSON spec (headings, paragraphs, " +
      "lists, tables, images, page breaks, headers/footers, page setup, metadata). " +
      "Call pdf_help(topic:'create_spec') for the full format. output_path must be absolute.",
    inputSchema: {
      spec: z.record(z.any()).describe("The document spec object -- see pdf_help(topic:'create_spec')"),
      output_path: z.string().describe("Absolute path to write the .pdf file to"),
    },
  },
  async ({ spec, output_path }) => {
    requireAbsolute(output_path, "output_path");
    fs.mkdirSync(path.dirname(output_path), { recursive: true });
    const specPath = writeTempJson(spec);
    try {
      const { stdout } = await runPython("create_pdf.py", ["--spec", specPath, "--out", output_path]);
      return { content: [{ type: "text", text: stdout.trim() }] };
    } finally {
      fs.unlinkSync(specPath);
    }
  }
);

// ---- pdf_read ----
server.registerTool(
  "pdf_read",
  {
    title: "Read a PDF document",
    description:
      "Extracts content from an existing .pdf as markdown or structured JSON " +
      "(per-page text, tables, hyperlinks, metadata). Can also extract embedded " +
      "images to a directory. input_path must be absolute.",
    inputSchema: {
      input_path: z.string().describe("Absolute path to the .pdf file to read"),
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
    const { stdout } = await runPython("read_pdf.py", args);
    return { content: [{ type: "text", text: stdout }] };
  }
);

// ---- pdf_edit ----
server.registerTool(
  "pdf_edit",
  {
    title: "Edit a PDF document",
    description:
      "Applies one or more operations to an existing .pdf and writes a new file. " +
      "Supports: merge, extract_pages, delete_pages, rotate_pages, reorder_pages, " +
      "insert_blank_page, add_watermark, add_page_numbers, set_metadata, encrypt, " +
      "decrypt. Call pdf_help(topic:'edit_ops') for the full list with examples. " +
      "input_path and output_path must be absolute.",
    inputSchema: {
      input_path: z.string().describe("Absolute path to the source .pdf file"),
      output_path: z.string().describe("Absolute path to write the edited .pdf file"),
      ops: z.array(z.record(z.any())).describe(
        "Array of operation objects, each with an 'op' field. See pdf_help(topic:'edit_ops')."
      ),
      password: z.string().optional().describe("Password to open input_path, if it's encrypted"),
    },
  },
  async ({ input_path, output_path, ops, password }) => {
    requireAbsolute(input_path, "input_path");
    requireAbsolute(output_path, "output_path");
    const opsPath = writeTempJson(ops);
    try {
      fs.mkdirSync(path.dirname(output_path), { recursive: true });
      const args = [input_path, "--out", output_path, "--ops", opsPath];
      if (password) args.push("--password", password);
      const { stdout, stderr } = await runPython("edit_pdf.py", args);
      return { content: [{ type: "text", text: stdout + (stderr ? `\n${stderr}` : "") }] };
    } finally {
      fs.unlinkSync(opsPath);
    }
  }
);

// ---- pdf_lint ----
server.registerTool(
  "pdf_lint",
  {
    title: "Structurally validate a PDF document",
    description:
      "Runs structural sanity checks on a .pdf (page count consistency, xref/trailer " +
      "integrity via qpdf --check if available, page-level readability). Not a full " +
      "PDF/A or ISO 32000 conformance validator, but catches the failure modes most " +
      "likely to make a generated/edited PDF unusable. input_path must be absolute.",
    inputSchema: {
      input_path: z.string().describe("Absolute path to the .pdf file to check"),
      password: z.string().optional().describe("Password, if the PDF is encrypted"),
    },
  },
  async ({ input_path, password }) => {
    requireAbsolute(input_path, "input_path");
    const args = [input_path];
    if (password) args.push("--password", password);
    try {
      const { stdout } = await runPython("lint_pdf.py", args);
      return { content: [{ type: "text", text: stdout }] };
    } catch (err) {
      return { content: [{ type: "text", text: err.message }] };
    }
  }
);

// ---- pdf_help ----
server.registerTool(
  "pdf_help",
  {
    title: "Reference for all pdf-toolkit tools and operations",
    description:
      "Returns usage reference for this toolkit -- what each tool does, its " +
      "arguments, the full create-spec section-type format, the full edit " +
      "operations list with argument shapes, and what's explicitly out of scope. " +
      "Call with no arguments for a top-level index, or 'topic' to get just that section.",
    inputSchema: {
      topic: z.enum([
        "overview", "pdf_create", "pdf_read", "pdf_edit", "pdf_lint",
        "create_spec", "edit_ops", "out_of_scope",
      ]).optional().describe("Which section to return. Omit for the full index of available topics."),
    },
  },
  async ({ topic }) => {
    if (!topic) {
      const index = { ...TOPICS.overview, available_topics: Object.keys(TOPICS) };
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
  console.error("pdf-toolkit MCP server running on stdio");
}

main().catch((err) => {
  console.error("pdf-toolkit MCP server failed to start:", err);
  process.exit(1);
});
