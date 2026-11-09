#!/usr/bin/env bash
# Generate images with xAI grok-imagine-image through an OpenAI-compatible router.
# Config comes from env or the project's gitignored .env:
#   IMAGE_API_BASE  router base URL, e.g. http://<host>:<port>/v1
#   IMAGE_API_KEY   router API key
#   IMAGE_MODEL     (default xai/grok-imagine-image)
#
# Usage: tools/grok-image.sh "<prompt>" <out-file-or-prefix> [n=1] [aspect_ratio]
#   tools/grok-image.sh "flat leaf icon on white" assets/leaf.jpg
#   tools/grok-image.sh "hero illustration ..." assets/hero.jpg 3 16:9   # -> hero-1.jpg ... hero-3.jpg
# aspect_ratio examples: 1:1 (1024x1024), 16:9 (1280x720), 9:16, 4:3, 3:4
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
[ -f "$ROOT/.env" ] && set -a && . "$ROOT/.env" && set +a

PROMPT="${1:?prompt required}"
OUT="${2:?output path required}"
N="${3:-1}"
ASPECT="${4:-}"
BASE="${IMAGE_API_BASE:?set IMAGE_API_BASE in env or .env}"
KEY="${IMAGE_API_KEY:?set IMAGE_API_KEY in env or .env}"
MODEL="${IMAGE_MODEL:-xai/grok-imagine-image}"

BODY=$(python3 -I -c 'import json,sys
m,p,n,a=sys.argv[1],sys.argv[2],int(sys.argv[3]),sys.argv[4]
b={"model":m,"prompt":p,"n":n,"response_format":"url"}
if a: b["aspect_ratio"]=a
print(json.dumps(b))' "$MODEL" "$PROMPT" "$N" "$ASPECT")

RESP=$(curl -sS -m 300 "$BASE/images/generations" \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -d "$BODY")

# imgen.x.ai rejects Python's default User-Agent (403), so downloads go through curl.
python3 -I - "$RESP" "$OUT" <<'PY'
import json, sys, os, subprocess
raw, out = sys.argv[1], sys.argv[2]
try:
    resp = json.loads(raw)
except json.JSONDecodeError:
    sys.exit(f"grok-image failed: non-JSON response: {raw[:500]}")
if "error" in resp or not resp.get("data"):
    sys.exit(f"grok-image failed: {json.dumps(resp, ensure_ascii=False)[:1000]}")
items = resp["data"]
root, ext = os.path.splitext(out)
for i, it in enumerate(items, 1):
    path = out if len(items) == 1 and ext else f"{root}-{i}{ext or '.jpg'}"
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    subprocess.run(["curl", "-sSfL", "-m", "120", "-o", path, it["url"]], check=True)
    print(path)
PY
