/**
 * help-content.js
 *
 * Structured reference content served by the docx_help tool. Kept as data
 * (not scattered across doc comments) so docx_help can return either the
 * full reference or a single topic on request, and so this stays the one
 * place to update when a tool's arguments change -- SKILL.md/USAGE.md cover
 * the same ground in prose for humans; this is the machine-callable version
 * for an agent mid-task that doesn't want to go read a file.
 */

const TOOLS = {
  docx_create: {
    summary: "Create a new .docx file from a structured JSON spec.",
    args: {
      spec: "object, required -- the document spec (see 'create_spec' topic)",
      output_path: "string, required -- ABSOLUTE path to write the .docx to",
      base_path: "string, optional -- ABSOLUTE directory relative image/shape paths in the spec resolve against; defaults to output_path's own directory",
    },
    example: {
      spec: {
        metadata: { title: "Sample" },
        sections: [
          { type: "heading", level: 1, text: "Overview" },
          { type: "paragraph", text: "Body text." },
        ],
      },
      output_path: "/absolute/path/to/report.docx",
    },
  },
  docx_read: {
    summary: "Extract content from an existing .docx as markdown or JSON.",
    args: {
      input_path: "string, required -- ABSOLUTE path to the .docx to read",
      format: "'markdown' | 'json', optional, default 'markdown'",
      extract_images_dir: "string, optional -- ABSOLUTE directory to dump embedded images into",
    },
    example: { input_path: "/absolute/path/to/report.docx", format: "json" },
    notes: "json format returns { paragraphs, headings, tables, headers, footers, hyperlinks, metadata }.",
  },
  docx_edit: {
    summary: "Apply one or more operations to an existing .docx, writing a new file.",
    args: {
      input_path: "string, required -- ABSOLUTE path to the source .docx",
      output_path: "string, required -- ABSOLUTE path to write the edited .docx to",
      ops: "array, required -- list of operation objects, each with an 'op' field (see 'edit_ops' topic). Run in array order.",
    },
    example: {
      input_path: "/absolute/path/to/report.docx",
      output_path: "/absolute/path/to/report_edited.docx",
      ops: [{ op: "find_replace", find: "Draft", replace: "Final" }],
    },
  },
  docx_lint: {
    summary: "Structural sanity check -- catches the specific bug classes lenient tools (python-docx, LibreOffice) miss but real Word rejects (paragraph/pPr ordering, table-cell property sequence, missing gridCol width, duplicate shading, section-properties placement, bookmark balance). NOT a full XSD validator.",
    args: {
      input_path: "string, required -- ABSOLUTE path to the .docx to check",
    },
    example: { input_path: "/absolute/path/to/report.docx" },
  },
  docx_help: {
    summary: "Returns this reference. Call with no arguments for the full index, or a 'topic' to get just that section.",
    args: {
      topic: "string, optional -- one of: " + "overview, docx_create, docx_read, docx_edit, docx_lint, create_spec, edit_ops, colors, out_of_scope",
    },
    example: { topic: "edit_ops" },
  },
};

const CREATE_SPEC = {
  top_level_fields: {
    title: "string, optional shorthand for metadata.title",
    pageSize: "'letter' (default) | 'a4'",
    orientation: "'portrait' (default) | 'landscape' -- auto-swaps page dimensions",
    margins: "{top, bottom, left, right} in inches",
    defaultFont: "string, default 'Calibri'",
    defaultFontSize: "number (pt), default 11",
    headingFont: "string, defaults to defaultFont",
    headingColor: "hex string no '#', default '1F4E79' (navy) -- applies to all heading levels",
    metadata: "{title, author, subject, keywords, category, description, lastModifiedBy}",
    header: "string, or {text, align}",
    footer: "string, or {text, align}",
    firstPageHeader: "string, or {text, align} -- different header on page 1 only",
    sections: "array, required -- see 'section_types' below",
  },
  section_types: {
    heading: "{type:'heading', level:1-4, text}",
    paragraph: "{type:'paragraph', text} OR {type:'paragraph', runs:[{text,bold,italic,underline,color,highlight,link}], align, indent:{left,right,firstLine,hanging} (inches), spacing:{before,after} (pt), keepWithNext, pageBreakBefore}",
    bulletList: "{type:'bulletList', items:[...], format:'bullet'(default)}",
    numberedList: "{type:'numberedList', items:[...], format:'decimal'(default)|'upperRoman'|'lowerRoman'|'upperLetter'|'lowerLetter'}",
    table: "{type:'table', columnWidths:[...], rows:[[...]] (first row=header unless header:false), headerColor, cellColors:{'row,col':hex}, cellVerticalAlign:'top'|'center'|'bottom', borders:false to omit}",
    image: "{type:'image', path, width, height} (px) -- path relative to base_path if not absolute",
    shape: "{type:'shape', text, width, height, bold} -- simple rectangular text box",
    pageBreak: "{type:'pageBreak'}",
  },
};

const EDIT_OPS = {
  find_replace: "{find, replace} -- merges split runs first so matches aren't missed",
  append_paragraph: "{text} or {runs:[{text,bold,italic,color,highlight}]}",
  append_heading: "{level, text} -- falls back to manual bold/sized text if the file lacks a matching 'Heading N' style",
  append_table: "{rows}",
  append_image: "{path, width, height}",
  insert_page_break: "{} -- no args",
  add_comment: "{anchor, text, author, initials} -- real Word review comment anchored to text containing 'anchor'",
  insert_hyperlink: "{url, text}",
  set_header: "{text}",
  set_footer: "{text}",
  resize_image: "{index (0-based), width, height} (px)",
  remove_page: "{index} -- operates on explicit page-break boundaries, not rendered/live pagination",
  move_page: "{from, to}",
  set_metadata: "{title, author, subject, keywords, category, comments, language, last_modified_by}",
  format_paragraph: "{anchor, align, indent:{left,right,firstLine,hanging}, spacing:{before,after,line}, keepWithNext, pageBreakBefore} -- targets the paragraph containing 'anchor'",
  add_table_row: "{table_index (0-based), cells}",
  delete_table_row: "{table_index, row_index}",
  add_table_column: "{table_index, cells, width (DXA, default 3000)}",
  delete_table_column: "{table_index, col_index}",
  merge_cells: "{table_index, start:[row,col], end:[row,col]}",
  set_cell_shading: "{table_index, cell:[row,col], color}",
  set_table_borders: "{table_index} -- applies built-in 'Table Grid' style; no-ops silently if unavailable",
  add_bookmark: "{anchor, name}",
  insert_page_number_field: "{target:'header'|'footer'} -- live field, Word computes value on open/F9",
  insert_toc_field: "{} -- live field, Word populates entries on open/F9",
  set_orientation: "{orientation:'portrait'|'landscape'}",
  set_margins: "{top, bottom, left, right} (inches)",
  add_watermark: "{text, color}",
};

const COLORS = {
  font_and_shading: "6-digit hex, no '#' (e.g. 'FF0000', '2E7D32')",
  highlight_values: ["yellow", "green", "cyan", "magenta", "blue", "red", "darkBlue", "darkCyan", "darkGreen", "darkMagenta", "darkRed", "darkYellow", "darkGray", "lightGray", "black"],
};

const OUT_OF_SCOPE = [
  "VBA macros", "OLE-embedded Excel/PowerPoint/PDF objects", "digital signatures",
  "SmartArt", "native charts", "equations", "mail-merge execution",
  "full document comparison / co-authoring metadata",
  "image effects (shadow, glow, 3D, crop, rotate, flip, wrap-through)",
  "QR/barcodes", "content-control form fields (checkboxes, dropdowns, date pickers)",
  "footnotes/endnotes", "track-changes accept/reject",
];

const OVERVIEW = {
  what_this_is: "docx-toolkit: create, read, and edit Microsoft Word (.docx) files via 5 MCP tools.",
  tools: Object.fromEntries(Object.entries(TOOLS).map(([name, t]) => [name, t.summary])),
  critical_rule: "Every file path argument (output_path, input_path, extract_images_dir, base_path) MUST be absolute. This server has no meaningful 'current directory' of its own.",
  workflow_tip: "Call docx_help with a 'topic' argument for details on any specific tool, the create spec format, the full edit-ops list, colors, or what's out of scope.",
};

const TOPICS = {
  overview: OVERVIEW,
  docx_create: TOOLS.docx_create,
  docx_read: TOOLS.docx_read,
  docx_edit: TOOLS.docx_edit,
  docx_lint: TOOLS.docx_lint,
  create_spec: CREATE_SPEC,
  edit_ops: EDIT_OPS,
  colors: COLORS,
  out_of_scope: OUT_OF_SCOPE,
};

module.exports = { TOPICS, OVERVIEW };
