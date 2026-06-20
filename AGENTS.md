<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Module conventions

- **No barrel files for internal code.** Don't add `index.ts` re-export files
  inside `src/`. Import directly from the source file
  (`@/lib/search-params/factory`, not `@/lib/search-params`). Barrels widen the
  module graph, leak the Server/Client boundary, and invite circular imports.
  (Barrels are only acceptable as the single public entry of a distributed
  package — which this app is not.)
- Mark Client modules with `"use client"` and import them directly; keep
  isomorphic/server code free of client-only imports.
