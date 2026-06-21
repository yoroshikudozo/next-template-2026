#!/usr/bin/env bash
# PostToolUse(Edit|Write|MultiEdit): consumer の .ts/.tsx が手書きの
# `new URLSearchParams` を含むとき、@/lib/search-params を使うよう促す。
# 非ブロック（exit 0）。additionalContext で Claude にだけ注意を注入する。

input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_input.path // empty' 2>/dev/null)

# .ts/.tsx 以外は対象外
case "$file" in
*.ts | *.tsx) ;;
*) exit 0 ;;
esac

# 層そのもの（とそのテスト）は URLSearchParams を正当に使うので除外
case "$file" in
*/lib/search-params/*) exit 0 ;;
esac

[ -f "$file" ] || exit 0

if grep -q 'new URLSearchParams' "$file" 2>/dev/null; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: "⚠️ 手書きの `new URLSearchParams` を検出。URL クエリは @/lib/search-params（createSearchParams / useSearchParamsState）を使ってください。配列は閉じた集合=comma・自由テキスト=repeat。詳細: src/lib/search-params/README.md"
    }
  }'
fi
exit 0
