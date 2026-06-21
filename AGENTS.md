<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Directory layout

Three layers, with a one-way dependency direction: **`app` → `features` → `lib`**.

- **`src/app/`** — routing only. `page.tsx`/`layout.tsx` await route props and
  delegate to a `features/` component. Keep them thin; no feature logic here.
- **`src/features/<name>/`** — non-component feature logic (its `schema.ts`,
  `hooks/`, `api/`, `types.ts`). A feature may import from `lib` and its own
  folder — never deep-import another feature (promote shared code to `lib`).
- **`src/components/`** — all React components. Generic primitives in
  `components/ui/`; feature components grouped in `components/<feature>/`.
- **`src/lib/`** — generic, feature-agnostic, reusable anywhere (e.g.
  `lib/search-params` mechanism, `lib/api` transport). `lib` must not know about
  any feature; if it imports from `features/`, it's misplaced.

# Module conventions

- **No barrel files for internal code.** Don't add `index.ts` re-export files
  inside `src/`. Import directly from the source file
  (`@/lib/search-params/factory`, not `@/lib/search-params`). Barrels widen the
  module graph, leak the Server/Client boundary, and invite circular imports.
  (Barrels are only acceptable as the single public entry of a distributed
  package — which this app is not.)
- Mark Client modules with `"use client"` and import them directly; keep
  isomorphic/server code free of client-only imports.
- **URL query params go through `@/lib/search-params`** (`createSearchParams` /
  `useSearchParamsState`); never hand-roll `URLSearchParams` parsing. Arrays:
  comma for closed sets, repeat for free text. See
  `src/lib/search-params/README.md`. (A PostToolUse hook warns on raw
  `new URLSearchParams` in consumer code.)
