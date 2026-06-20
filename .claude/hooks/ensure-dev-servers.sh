#!/usr/bin/env bash
# PreToolUse(mcp__chrome-devtools__* | mcp__next-devtools__*): make sure the dev
# servers Claude inspects against are running, then let the tool proceed:
#   :3000  Next dev  -> next-devtools MCP + the real app
#   :6006  Storybook -> chrome-devtools / storybook MCP
# Starts whichever is down in the background (detached, with a visible window for
# the browser the MCP drives). Best-effort: never blocks the tool — always exits 0.
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
mkdir -p .claude/.run

is_up() { curl -fsS -o /dev/null --max-time 2 "http://127.0.0.1:$1" 2>/dev/null; }

start_if_down() {
  local port="$1" name="$2"
  shift 2
  if is_up "$port"; then
    return 0
  fi
  nohup "$@" >".claude/.run/${name}.log" 2>&1 &
  disown 2>/dev/null || true
}

# npm run dev loads .env.loc via scripts/with-env.mjs.
start_if_down 3000 next npm run dev
# --ci: skip prompts and don't open a tab (the MCP-driven browser navigates here).
start_if_down 6006 storybook npx storybook dev -p 6006 --ci

# Wait for first compile (best-effort; the tool proceeds regardless).
for _ in $(seq 1 90); do
  if is_up 3000 && is_up 6006; then
    exit 0
  fi
  sleep 1
done

echo "ensure-dev-servers: dev servers still starting (see .claude/.run/*.log)" >&2
exit 0
