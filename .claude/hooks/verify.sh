#!/usr/bin/env bash
# Stop hook: typecheck + fast unit tests so regressions surface before the turn
# ends. On failure, exit 2 to report back to Claude; otherwise stay quiet.
# (Heavier suites — Storybook browser tests, e2e — are left to CI/manual runs.)
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

failed=""
npx tsc --noEmit >/tmp/claude-verify-tsc.log 2>&1 || failed="$failed tsc"
npx vitest run --project=unit >/tmp/claude-verify-vitest.log 2>&1 || failed="$failed vitest(unit)"

if [ -n "$failed" ]; then
  echo "verify.sh: failing checks:$failed (logs: /tmp/claude-verify-tsc.log, /tmp/claude-verify-vitest.log)" >&2
  exit 2
fi

exit 0
