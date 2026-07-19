import sys, zipfile
from lxml import etree

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

PPR_CHILD_ORDER = ["pStyle","keepNext","keepLines","pageBreakBefore","framePr","widowControl",
    "numPr","suppressLineNumbers","pBdr","shd","tabs","suppressAutoHyphens","kinsoku",
    "wordWrap","overflowPunct","topLinePunct","autoSpaceDE","autoSpaceDN","bidi",
    "adjustRightInd","snapToGrid","spacing","ind","contextualSpacing","mirrorIndents",
    "suppressOverlap","jc","textDirection","textAlignment","textboxTightWrap",
    "outlineLvl","divId","cnfStyle","rPr","sectPr","pPrChange"]

TCPR_CHILD_ORDER = ["cnfStyle","tcW","gridSpan","hMerge","vMerge","tcBorders","shd",
    "noWrap","tcMar","textDirection","tcFitText","vAlign","hideMark","cellIns",
    "cellDel","cellMerge","tcPrChange"]

def check_p_order(root, issues):
    for p in root.iter(f"{W}p"):
        children_tags = [c.tag.split("}")[-1] for c in p]
        if "pPr" in children_tags:
            idx = children_tags.index("pPr")
            if idx != 0:
                issues.append(f"<w:p> has pPr not as first child: {children_tags[:5]}")

def check_tcpr_order(root, issues):
    for tcpr in root.iter(f"{W}tcPr"):
        tags = [c.tag.split("}")[-1] for c in tcpr if c.tag.split("}")[-1] in TCPR_CHILD_ORDER]
        order_indices = [TCPR_CHILD_ORDER.index(t) for t in tags]
        if order_indices != sorted(order_indices):
            issues.append(f"<w:tcPr> children out of schema order: {tags}")

def check_gridcol_width(root, issues):
    for gc in root.iter(f"{W}gridCol"):
        if gc.get(f"{W}w") is None:
            issues.append("<w:gridCol> missing required w:w attribute")

def check_sectpr_position(root, issues):
    body = root.find(f"{W}body")
    if body is None:
        return
    children = list(body)
    sectprs = [i for i,c in enumerate(children) if c.tag == f"{W}sectPr"]
    for i in sectprs:
        if i != len(children) - 1:
            issues.append(f"body-level <w:sectPr> not last child (at index {i} of {len(children)})")

def check_bookmark_balance(root, issues):
    starts = [e.get(f"{W}id") for e in root.iter(f"{W}bookmarkStart")]
    ends = [e.get(f"{W}id") for e in root.iter(f"{W}bookmarkEnd")]
    if sorted(starts) != sorted(ends):
        issues.append(f"unbalanced bookmarks: starts={starts} ends={ends}")

def lint_file(path):
    issues = []
    with zipfile.ZipFile(path) as z:
        with z.open("word/document.xml") as f:
            root = etree.parse(f).getroot()
        check_p_order(root, issues)
        check_tcpr_order(root, issues)
        check_gridcol_width(root, issues)
        check_sectpr_position(root, issues)
        check_bookmark_balance(root, issues)
        # also check headers/footers
        for name in z.namelist():
            if name.startswith("word/header") or name.startswith("word/footer"):
                with z.open(name) as f:
                    hroot = etree.parse(f).getroot()
                check_p_order(hroot, issues)
    return issues

if __name__ == "__main__":
    for path in sys.argv[1:]:
        issues = lint_file(path)
        if issues:
            print(f"[FAIL] {path}")
            for i in issues:
                print(f"   - {i}")
        else:
            print(f"[OK] {path}")
