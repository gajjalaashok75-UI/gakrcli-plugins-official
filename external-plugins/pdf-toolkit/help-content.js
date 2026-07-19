/**
 * help-content.js
 * Structured reference content served by the pdf_help tool. Kept as data
 * so pdf_help can return either the full reference or a single topic.
 */

const TOOLS = {
  pdf_create: {
    summary: "Create a new .pdf file from a structured JSON spec.",
    args: {
      spec: "object, required -- the document spec (see 'create_spec' topic)",
      output_path: "string, required -- ABSOLUTE path to write the .pdf to",
    },
    example: {
      spec: {
        metadata: { title: "Sample" },
        sections: [
          { type: "heading", level: 1, text: "Overview" },
          { type: "paragraph", text: "Body text." },
        ],
      },
      output_path: "/absolute/path/to/report.pdf",
    },
  },
  pdf_read: {
    summary: "Extract content from an existing .pdf as markdown or JSON.",
    args: {
      input_path: "string, required -- ABSOLUTE path to the .pdf to read",
      format: "'markdown' | 'json', optional, default 'markdown'",
      extract_images_dir: "string, optional -- ABSOLUTE directory to dump embedded images into",
    },
    example: { input_path: "/absolute/path/to/report.pdf", format: "json" },
    notes: "json format returns { metadata, pages: [{page, text, tables}], hyperlinks }.",
  },
  pdf_edit: {
    summary: "Apply one or more operations to an existing .pdf, writing a new file.",
    args: {
      input_path: "string, required -- ABSOLUTE path to the source .pdf",
      output_path: "string, required -- ABSOLUTE path to write the edited .pdf to",
      ops: "array, required -- list of operation objects, each with an 'op' field (see 'edit_ops' topic). Run in array order.",
      password: "string, optional -- password to open input_path if it's encrypted",
    },
    example: {
      input_path: "/absolute/path/to/report.pdf",
      output_path: "/absolute/path/to/report_edited.pdf",
      ops: [{ op: "add_watermark", text: "DRAFT" }],
    },
  },
  pdf_lint: {
    summary: "Structural sanity check -- page count consistency, xref/trailer integrity via qpdf --check if available, page-level readability. NOT a full PDF/A or ISO 32000 conformance validator.",
    args: {
      input_path: "string, required -- ABSOLUTE path to the .pdf to check",
      password: "string, optional -- password if the PDF is encrypted",
    },
    example: { input_path: "/absolute/path/to/report.pdf" },
  },
  pdf_help: {
    summary: "Returns this reference. Call with no arguments for the full index, or a 'topic' to get just that section.",
    args: {
      topic: "string, optional -- one of: overview, pdf_create, pdf_read, pdf_edit, pdf_lint, create_spec, edit_ops, out_of_scope",
    },
    example: { topic: "edit_ops" },
  },
};

const CREATE_SPEC = {
  top_level_fields: {
    pageSize: "'letter' (default) | 'a4'",
    orientation: "'portrait' (default) | 'landscape'",
    margins: "{top, bottom, left, right} in inches",
    defaultFontSize: "number (pt), default 11",
    headingFont: "string, default 'Helvetica'",
    headingColor: "hex string no '#', default '1F4E79' (navy)",
    metadata: "{title, author, subject}",
    header: "string, or {text}",
    footer: "string, or {text}",
    sections: "array, required -- see 'section_types' below",
  },
  section_types: {
    heading: "{type:'heading', level:1-4, text}",
    paragraph: "{type:'paragraph', text} OR {type:'paragraph', runs:[{text,bold,italic,underline,color,highlight,link}], align:'left'|'center'|'right'|'justify', indent:{left,right,firstLine} (inches), spacing:{before,after} (pt)}",
    bulletList: "{type:'bulletList', items:[...]}",
    numberedList: "{type:'numberedList', items:[...]}",
    table: "{type:'table', columnWidths:[...] (pt), rows:[[...]] (first row=header unless header:false), headerColor}",
    image: "{type:'image', path, width, height} (px) -- path relative to the spec file's own directory if not absolute",
    pageBreak: "{type:'pageBreak'}",
    spacer: "{type:'spacer', height} (pt)",
  },
  notes: "Highlight has no true background-color equivalent in the underlying PDF library -- 'highlight' on a run approximates with a distinct foreground color instead of a highlighted background.",
};

const EDIT_OPS = {
  merge: "{path} or {paths:[...]} -- appends all pages from the given PDF(s) at the end, in order",
  extract_pages: "{start, end} -- 0-based inclusive page range; discards everything outside it",
  delete_pages: "{indices:[...]} -- 0-based page indices to remove",
  rotate_pages: "{indices:[...] or omit for all, degrees} -- degrees should be a multiple of 90",
  reorder_pages: "{order:[...]} -- 0-based permutation of all page indices in the new desired order",
  insert_blank_page: "{index (default: end), width, height} (pt, defaults to match page 0)",
  add_watermark: "{text, color} -- diagonal, semi-transparent, centered on every page",
  add_page_numbers: "{position:'bottom-center'(default)|'bottom-right'|'top-center', format:'Page {n} of {total}'(default), color}",
  set_metadata: "{title, author, subject, keywords, creator} -- preserves existing fields not specified",
  encrypt: "{user_password, owner_password (defaults to user_password)}",
  decrypt: "{} -- requires the correct password via pdf_edit's top-level 'password' argument, not inside the op itself",
};

const OUT_OF_SCOPE = [
  "Fillable form field creation/filling", "digital signatures", "OCR / scanned-text recognition",
  "PDF/A or other archival conformance conversion", "redaction (true content removal, not just visual covering)",
  "embedded video/audio/3D objects", "JavaScript actions", "bookmarks/outline tree editing",
  "annotations other than watermark/page-number overlays (no sticky notes, highlights, freeform drawing)",
  "linearization (\"fast web view\") optimization", "color space conversion (CMYK/ICC profile management)",
];

const OVERVIEW = {
  what_this_is: "pdf-toolkit: create, read, and edit PDF files via 5 MCP tools.",
  tools: Object.fromEntries(Object.entries(TOOLS).map(([name, t]) => [name, t.summary])),
  critical_rule: "Every file path argument (output_path, input_path, extract_images_dir) MUST be absolute. This server has no meaningful 'current directory' of its own.",
  workflow_tip: "Call pdf_help with a 'topic' argument for details on any specific tool, the create spec format, the full edit-ops list, or what's out of scope.",
};

const TOPICS = {
  overview: OVERVIEW,
  pdf_create: TOOLS.pdf_create,
  pdf_read: TOOLS.pdf_read,
  pdf_edit: TOOLS.pdf_edit,
  pdf_lint: TOOLS.pdf_lint,
  create_spec: CREATE_SPEC,
  edit_ops: EDIT_OPS,
  out_of_scope: OUT_OF_SCOPE,
};

module.exports = { TOPICS, OVERVIEW };
