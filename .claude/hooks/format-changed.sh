#!/usr/bin/env bash
# PostToolUse(Edit|Write|MultiEdit): format the edited file with Prettier, then
# eslint --fix for code files. Reads the hook payload (JSON) from stdin.
# Never blocks the tool result: always exits 0.
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

file=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{process.stdout.write(JSON.parse(s).tool_input?.file_path||"")}catch{process.stdout.write("")}})')

[ -n "$file" ] && [ -f "$file" ] || exit 0

case "$file" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs | *.json | *.css | *.md | *.mdx)
    npx prettier --write "$file" >/dev/null 2>&1 || true
    ;;
  *)
    exit 0
    ;;
esac

case "$file" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs)
    npx eslint --fix "$file" >/dev/null 2>&1 || true
    ;;
esac

exit 0
