#!/usr/bin/env node
/**
 * create_docx.js
 * CLI wrapper around lib/docx_builder.js -- builds a new .docx file from a
 * JSON spec. See SKILL.md / USAGE.md for the full spec format.
 *
 * Usage:
 *   node create_docx.js --spec spec.json --out output.docx
 *   cat spec.json | node create_docx.js --out output.docx
 */

const fs = require("fs");
const path = require("path");
const { buildDocxBuffer } = require("../lib/docx_builder");

function parseArgs(argv) {
  const args = { spec: null, out: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--spec") args.spec = argv[++i];
    else if (argv[i] === "--out") args.out = argv[++i];
  }
  return args;
}

function readSpec(specPath) {
  const raw = specPath
    ? fs.readFileSync(specPath, "utf8")
    : fs.readFileSync(0, "utf8");
  return JSON.parse(raw);
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.out) {
    console.error("Usage: node create_docx.js --spec spec.json --out output.docx");
    process.exit(1);
  }
  const spec = readSpec(args.spec);
  // Relative image/shape paths in the spec resolve against the CLI's own
  // working directory, same as before this was refactored into a library.
  const basePath = process.cwd();

  const buffer = await buildDocxBuffer(spec, basePath);
  fs.writeFileSync(args.out, buffer);

  const stat = fs.statSync(args.out);
  if (stat.size < 100) {
    throw new Error("Output file suspiciously small — generation likely failed");
  }

  console.log(`Created ${args.out} (${stat.size} bytes)`);
}

main().catch((err) => {
  console.error("create_docx.js failed:", err.message);
  process.exit(1);
});
