#!/usr/bin/env bash
# Manual setup fallback for pdf-toolkit.
# Note: when installed as a GAKRCLI plugin, .mcp.json's start script
# (bin/bootstrap.js) does this automatically on first launch. This script is
# for standalone/manual use, or if that automatic step didn't work in your
# environment.
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "== pdf-toolkit setup =="

MISSING=""
for pkg in @modelcontextprotocol/sdk zod; do
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

for pkg in pypdf pdfplumber reportlab; do
  if python3 -c "import $pkg" >/dev/null 2>&1; then
    echo "[ok] python '$pkg' package already available"
  else
    echo "[..] installing python '$pkg' package"
    pip install "$pkg" --break-system-packages 2>/dev/null || pip install "$pkg"
  fi
done

if command -v qpdf >/dev/null 2>&1; then
  echo "[ok] qpdf present (used by pdf_lint for independent structural validation)"
else
  echo "[--] qpdf not found -- pdf_lint will skip its independent structural check but pypdf-level checks still work. Install qpdf for the full check."
fi

echo "== setup complete =="
