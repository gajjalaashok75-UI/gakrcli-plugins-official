/**
 * lib/docx_builder.js
 *
 * Core .docx-generation logic, extracted so it can be called directly
 * in-process (by the MCP server) as well as from the create_docx.js CLI --
 * both paths run the exact same tested code, so there's no drift between
 * "the script someone runs by hand" and "what the server does."
 *
 * Unlike the original CLI-only version, all per-document state (shape
 * placeholders, counters) is scoped inside buildDocxBuffer() rather than
 * held in module-level variables -- module-level mutable state would leak
 * between concurrent calls in a long-running server process, corrupting
 * unrelated documents built around the same time.
 */

const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  ImageRun,
  PageBreak,
  AlignmentType,
  LevelFormat,
  convertInchesToTwip,
  ExternalHyperlink,
  Header,
  Footer,
  HighlightColor,
  BorderStyle,
  VerticalAlign,
  PageOrientation,
} = require("docx");

const PAGE_SIZES = {
  letter: { width: 12240, height: 15840 },
  a4: { width: 11906, height: 16838 },
};

const ALIGN_MAP = {
  left: AlignmentType.LEFT,
  center: AlignmentType.CENTER,
  right: AlignmentType.RIGHT,
  justify: AlignmentType.JUSTIFIED,
};

const HEADING_MAP = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
  4: HeadingLevel.HEADING_4,
};

const LIST_FORMAT_MAP = {
  bullet: LevelFormat.BULLET,
  decimal: LevelFormat.DECIMAL,
  upperRoman: LevelFormat.UPPER_ROMAN,
  lowerRoman: LevelFormat.LOWER_ROMAN,
  upperLetter: LevelFormat.UPPER_LETTER,
  lowerLetter: LevelFormat.LOWER_LETTER,
};

const LIST_TEXT_MAP = {
  bullet: "\u2022",
  decimal: "%1.",
  upperRoman: "%1.",
  lowerRoman: "%1.",
  upperLetter: "%1.",
  lowerLetter: "%1.",
};

function buildRun(r) {
  if (r.link) {
    return new ExternalHyperlink({
      link: r.link,
      children: [
        new TextRun({
          text: r.text,
          style: "Hyperlink",
          bold: !!r.bold,
          italics: !!r.italic,
        }),
      ],
    });
  }
  return new TextRun({
    text: r.text,
    bold: !!r.bold,
    italics: !!r.italic,
    underline: r.underline ? {} : undefined,
    color: r.color || undefined,
    highlight: r.highlight ? (HighlightColor[r.highlight.toUpperCase()] || r.highlight.toLowerCase()) : undefined,
    highlightComplexScript: false,
  });
}

function buildParagraphProps(section) {
  const props = { alignment: ALIGN_MAP[section.align] };
  if (section.indent) {
    props.indent = {
      left: section.indent.left ? convertInchesToTwip(section.indent.left) : undefined,
      right: section.indent.right ? convertInchesToTwip(section.indent.right) : undefined,
      firstLine: section.indent.firstLine ? convertInchesToTwip(section.indent.firstLine) : undefined,
      hanging: section.indent.hanging ? convertInchesToTwip(section.indent.hanging) : undefined,
    };
  }
  if (section.spacing) {
    props.spacing = {
      before: section.spacing.before ? section.spacing.before * 20 : undefined,
      after: section.spacing.after ? section.spacing.after * 20 : undefined,
      line: section.spacing.line ? section.spacing.line * 240 : undefined,
    };
  }
  if (section.keepWithNext) props.keepNext = true;
  if (section.pageBreakBefore) props.pageBreakBefore = true;
  return props;
}

function buildParagraphFromRuns(section) {
  const props = buildParagraphProps(section);
  if (section.runs) {
    const runs = section.runs.map(buildRun);
    return new Paragraph({ children: runs, ...props });
  }
  return new Paragraph({
    children: [new TextRun({ text: section.text || "" })],
    ...props,
  });
}

function buildList(section, isNumbered) {
  const format = section.format || (isNumbered ? "decimal" : "bullet");
  const reference = `list-${format}`;
  return section.items.map(
    (item) =>
      new Paragraph({
        text: item,
        numbering: { reference, level: 0 },
      })
  );
}

function collectListFormats(sections) {
  const formats = new Set();
  for (const s of sections) {
    if (s.type === "bulletList") formats.add(s.format || "bullet");
    if (s.type === "numberedList") formats.add(s.format || "decimal");
  }
  return formats;
}

function buildTable(section) {
  const colWidths = section.columnWidths || section.rows[0].map(() => 3000);
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const headerFill = (section.headerColor || "D9D9D9").replace("#", "");
  const cellColors = section.cellColors || {};
  const vAlignMap = { top: VerticalAlign.TOP, center: VerticalAlign.CENTER, bottom: VerticalAlign.BOTTOM };

  const rows = section.rows.map((rowCells, rowIndex) => {
    const isHeader = rowIndex === 0 && section.header !== false;
    const cells = rowCells.map((cellText, colIndex) => {
      const customColor = cellColors[`${rowIndex},${colIndex}`];
      const fill = isHeader ? headerFill : customColor ? customColor.replace("#", "") : undefined;
      return new TableCell({
        width: { size: colWidths[colIndex] || 3000, type: WidthType.DXA },
        shading: fill ? { fill, type: ShadingType.CLEAR, color: "auto" } : undefined,
        verticalAlign: vAlignMap[section.cellVerticalAlign] || undefined,
        children: [
          new Paragraph({
            children: [new TextRun({ text: String(cellText), bold: isHeader })],
          }),
        ],
      });
    });
    return new TableRow({ children: cells });
  });

  const borderStyle = section.borders === false
    ? undefined
    : {
        top: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
        left: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
        right: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      };

  return new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    borders: borderStyle,
    rows,
  });
}

function buildImage(section, basePath) {
  const imgPath = path.isAbsolute(section.path) ? section.path : path.join(basePath, section.path);
  const data = fs.readFileSync(imgPath);
  const ext = path.extname(imgPath).replace(".", "").toLowerCase();
  const type = ["png", "jpg", "jpeg", "gif", "bmp"].includes(ext)
    ? ext === "jpeg"
      ? "jpg"
      : ext
    : "png";
  return new Paragraph({
    children: [
      new ImageRun({
        data,
        type,
        transformation: {
          width: section.width || 300,
          height: section.height || 200,
        },
      }),
    ],
  });
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHeaderFooter(spec) {
  if (!spec) return undefined;
  const text = typeof spec === "string" ? spec : spec.text || "";
  return new Paragraph({
    alignment: ALIGN_MAP[(typeof spec === "object" && spec.align) || "center"],
    children: [new TextRun({ text })],
  });
}

/**
 * Builds a complete .docx file in memory and returns it as a Buffer.
 * `basePath` resolves relative `image`/`shape` paths in the spec -- pass the
 * directory those paths should be considered relative to (e.g. the caller's
 * working directory), since a long-running server has no single meaningful
 * "current directory" of its own.
 */
async function buildDocxBuffer(spec, basePath) {
  basePath = basePath || process.cwd();

  // Per-call state for the shape-placeholder workaround -- scoped per
  // invocation, not module-level, so concurrent calls in a server process
  // can't corrupt each other's shapes.
  const shapeState = { counter: 0, pending: [] };

  function buildShape(section) {
    shapeState.counter += 1;
    const marker = `__SHAPE_PLACEHOLDER_${shapeState.counter}__`;
    shapeState.pending.push({
      marker,
      text: section.text || "",
      width: section.width || 200,
      height: section.height || 100,
      bold: !!section.bold,
    });
    return new Paragraph({ children: [new TextRun({ text: marker })] });
  }

  function applyShapeFixups(xml) {
    let result = xml;
    for (const shape of shapeState.pending) {
      const runRegex = new RegExp(`<w:r>(?:(?!</w:r>).)*?${shape.marker}(?:(?!</w:r>).)*?</w:r>`, "s");
      const widthPt = Math.round((shape.width / 96) * 72);
      const heightPt = Math.round((shape.height / 96) * 72);
      const shapeXml =
        `<w:r><w:pict><v:shapetype id="_x0000_t202" coordsize="21600,21600" o:spt="202" path="m,l,21600r21600,l21600,xe"/>` +
        `<v:shape type="#_x0000_t202" style="width:${widthPt}pt;height:${heightPt}pt">` +
        `<v:textbox style="mso-fit-shape-to-text:t;" insetmode="auto">` +
        `<w:txbxContent><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r>` +
        (shape.bold ? "<w:rPr><w:b/></w:rPr>" : "") +
        `<w:t xml:space="preserve">${escapeXml(shape.text)}</w:t></w:r></w:p></w:txbxContent>` +
        `</v:textbox></v:shape></w:pict></w:r>`;
      result = result.replace(runRegex, shapeXml);
    }
    return result;
  }

  function buildSection(section) {
    switch (section.type) {
      case "heading":
        return new Paragraph({
          text: section.text,
          heading: HEADING_MAP[section.level || 1] || HeadingLevel.HEADING_1,
        });
      case "paragraph":
        return buildParagraphFromRuns(section);
      case "bulletList":
        return buildList(section, false);
      case "numberedList":
        return buildList(section, true);
      case "table":
        return buildTable(section);
      case "image":
        return buildImage(section, basePath);
      case "shape":
        return buildShape(section);
      case "pageBreak":
        return new Paragraph({ children: [new PageBreak()] });
      default:
        throw new Error(`Unknown section type: ${section.type}`);
    }
  }

  function flatten(items) {
    const out = [];
    for (const c of items) {
      if (Array.isArray(c)) out.push(...c);
      else out.push(c);
    }
    return out;
  }

  let pageSize = PAGE_SIZES[(spec.pageSize || "letter").toLowerCase()] || PAGE_SIZES.letter;
  const orientation = (spec.orientation || "portrait").toLowerCase() === "landscape"
    ? PageOrientation.LANDSCAPE
    : PageOrientation.PORTRAIT;

  const children = flatten((spec.sections || []).map(buildSection));

  const headerPara = buildHeaderFooter(spec.header);
  const footerPara = buildHeaderFooter(spec.footer);
  const firstPageHeaderPara = buildHeaderFooter(spec.firstPageHeader);

  const usedFormats = collectListFormats(spec.sections || []);
  const numberingConfig = Array.from(usedFormats).map((format) => ({
    reference: `list-${format}`,
    levels: [
      {
        level: 0,
        format: LIST_FORMAT_MAP[format] || LevelFormat.BULLET,
        text: LIST_TEXT_MAP[format] || "\u2022",
        alignment: AlignmentType.LEFT,
        style: {
          paragraph: {
            indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.25) },
          },
        },
      },
    ],
  }));

  const margins = spec.margins
    ? {
        top: convertInchesToTwip(spec.margins.top ?? 1),
        bottom: convertInchesToTwip(spec.margins.bottom ?? 1),
        left: convertInchesToTwip(spec.margins.left ?? 1),
        right: convertInchesToTwip(spec.margins.right ?? 1),
      }
    : undefined;

  const bodyFont = spec.defaultFont || "Calibri";
  const bodySize = (spec.defaultFontSize || 11) * 2;
  const headingColor = (spec.headingColor || "1F4E79").replace("#", "");
  const headingFont = spec.headingFont || bodyFont;

  const styles = {
    default: {
      document: {
        run: { font: bodyFont, size: bodySize },
        paragraph: { spacing: { line: 259, after: 160 } },
      },
      heading1: {
        run: { font: headingFont, size: 40, bold: true, color: headingColor },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 },
      },
      heading2: {
        run: { font: headingFont, size: 32, bold: true, color: headingColor },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 },
      },
      heading3: {
        run: { font: headingFont, size: 26, bold: true, color: headingColor },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 },
      },
      heading4: {
        run: { font: headingFont, size: 24, bold: true, italics: true, color: headingColor },
        paragraph: { spacing: { before: 120, after: 60 }, outlineLevel: 3 },
      },
      hyperlink: { run: { color: "0563C1", underline: {} } },
    },
  };

  const doc = new Document({
    title: spec.metadata?.title,
    subject: spec.metadata?.subject,
    creator: spec.metadata?.author,
    keywords: spec.metadata?.keywords,
    description: spec.metadata?.description,
    category: spec.metadata?.category,
    lastModifiedBy: spec.metadata?.lastModifiedBy,
    styles,
    numbering: numberingConfig.length ? { config: numberingConfig } : undefined,
    sections: [
      {
        properties: {
          page: { size: { ...pageSize, orientation }, margin: margins },
          titlePage: !!firstPageHeaderPara,
        },
        headers: {
          default: headerPara ? new Header({ children: [headerPara] }) : undefined,
          first: firstPageHeaderPara ? new Header({ children: [firstPageHeaderPara] }) : undefined,
        },
        footers: footerPara ? { default: new Footer({ children: [footerPara] }) } : undefined,
        children,
      },
    ],
  });

  let buffer = await Packer.toBuffer(doc);

  const zip = await JSZip.loadAsync(buffer);
  const docXmlPath = "word/document.xml";
  let docXml = await zip.file(docXmlPath).async("string");
  let fixedXml = applyShapeFixups(docXml);
  fixedXml = fixedXml.replace(
    /<w:p>(<w:pict>[\s\S]*?<\/w:pict>)<\/w:p>/g,
    "<w:p><w:r>$1</w:r></w:p>"
  );
  if (fixedXml !== docXml) {
    zip.file(docXmlPath, fixedXml);
    buffer = await zip.generateAsync({ type: "nodebuffer" });
  }

  return buffer;
}

module.exports = { buildDocxBuffer };
