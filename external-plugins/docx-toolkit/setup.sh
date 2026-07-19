#!/usr/bin/env bash
# Manual setup fallback for docx-toolkit.
# Note: when installed as a GAKRCLI plugin, .mcp.json's start script
# (bin/bootstrap.js) does this automatically on first launch. This script is
# for standalone/manual use, or if that automatic step didn't work in your
# environment.
# Safe to re-run; skips steps whose dependency is already present.
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "== docx-toolkit setup =="

# --- Node.js dependencies: docx, jszip, @modelcontextprotocol/sdk, zod ---
MISSING=""
for pkg in docx jszip @modelcontextprotocol/sdk zod; do
  if ! node -e "require.resolve('$pkg', { paths: ['$DIR'] })" >/dev/null 2>&1; then
    MISSING="$MISSING $pkg"
  fi
done

if [ -z "$MISSING" ]; then
  echo "[ok] all Node dependencies already available"
else
  echo "[..] installing Node dependencies:$MISSING"
  (cd "$DIR" && npm install --no-audit --no-fund)
fi

# --- Python dependency: python-docx (for read_docx.py / edit_docx.py / lint_docx.py) ---
if python3 -c "import docx" >/dev/null 2>&1; then
  echo "[ok] python 'python-docx' package already available"
else
  echo "[..] installing python 'python-docx' package"
  pip install python-docx --break-system-packages 2>/dev/null || pip install python-docx
fi

# --- Optional: visual verification tools (not required for core operations) ---
if command -v soffice >/dev/null 2>&1 && command -v pdftoppm >/dev/null 2>&1; then
  echo "[ok] LibreOffice + poppler present (visual verification available)"
else
  echo "[--] LibreOffice/poppler not found — visual verification step will be unavailable, but create/read/edit/lint still work fully without it"
fi

echo "== setup complete =="
