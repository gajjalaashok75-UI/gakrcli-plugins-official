#!/usr/bin/env python3
"""
lint_pdf.py
Structural sanity check for a .pdf file: confirms it opens, page count is
consistent, xref/trailer isn't corrupted, and (if qpdf is available) runs a
proper structural check via `qpdf --check`. Not a full PDF/A or ISO 32000
conformance validator -- catches the failure modes most likely to make a
generated/edited PDF unusable.

Usage:
    python3 lint_pdf.py input.pdf
    python3 lint_pdf.py input.pdf --password secret
"""

import argparse
import shutil
import subprocess
import sys

from pypdf import PdfReader
from pypdf.errors import PdfReadError


def lint(path, password=None):
    issues = []

    try:
        reader = PdfReader(path)
    except Exception as e:
        return [f"could not open file at all: {e}"]

    if reader.is_encrypted:
        try:
            result = reader.decrypt(password if password else "")
            if result == 0:
                issues.append("file is encrypted and the given password (or empty password) did not work")
                return issues
        except Exception as e:
            issues.append(f"file is encrypted and could not be decrypted: {e}")
            return issues

    try:
        page_count = len(reader.pages)
        if page_count == 0:
            issues.append("document has zero pages")
    except Exception as e:
        issues.append(f"could not determine page count: {e}")
        return issues

    for i, page in enumerate(reader.pages):
        try:
            _ = page.mediabox
        except Exception as e:
            issues.append(f"page {i}: could not read mediabox: {e}")
        try:
            _ = page.extract_text()
        except Exception as e:
            issues.append(f"page {i}: text extraction raised an error: {e}")

    # qpdf --check is a real, independent structural validator (xref table
    # integrity, stream lengths, object structure) -- much more authoritative
    # than "did pypdf not raise an exception", the same way direct XSD
    # validation was more authoritative than "python-docx re-opened it" for
    # the docx toolkit.
    if shutil.which("qpdf"):
        try:
            cmd = ["qpdf", "--check"]
            if password:
                cmd.append(f"--password={password}")
            cmd.append(path)
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            output = (result.stdout + result.stderr).strip()
            if result.returncode != 0:
                issues.append(f"qpdf --check reported problems:\n{output}")
        except subprocess.TimeoutExpired:
            issues.append("qpdf --check timed out")
    else:
        issues.append("(qpdf not installed -- skipped the independent structural check; pypdf-level checks above still ran)")

    return issues


def main():
    parser = argparse.ArgumentParser(description="Structurally validate a .pdf file")
    parser.add_argument("input", help="Path to the .pdf file")
    parser.add_argument("--password", default=None, help="Password if the PDF is encrypted")
    args = parser.parse_args()

    issues = lint(args.input, args.password)
    # The qpdf-not-installed note is informational, not a failure -- only
    # real problems should make this look like a failed check.
    real_issues = [i for i in issues if not i.startswith("(qpdf not installed")]

    if real_issues:
        print(f"[FAIL] {args.input}")
        for issue in issues:
            print(f"   - {issue}")
        sys.exit(1)
    else:
        print(f"[OK] {args.input}")
        for issue in issues:
            print(f"   - {issue}")


if __name__ == "__main__":
    main()
