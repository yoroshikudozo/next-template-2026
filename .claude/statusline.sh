#!/usr/bin/env bash
# Status line: "<model> | <git branch> | <dir>". Reads session JSON from stdin.
input=$(cat)

{
  read -r model
  read -r dir
} < <(
  printf '%s' "$input" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);console.log(j.model?.display_name||"?");console.log(j.workspace?.current_dir||j.cwd||"")}catch{console.log("?");console.log("")}})'
)

branch=$(git -C "${dir:-.}" branch --show-current 2>/dev/null || true)

printf '%s | %s | %s' "$model" "${branch:-no-branch}" "$(basename "${dir:-.}")"
