/** @type {import("lint-staged").Configuration} */
const config = {
  "*.{js,jsx,ts,tsx,mjs,cjs}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md,mdx,yml,yaml}": ["prettier --write"],
  // tsc ignores tsconfig when given file args, so run a full project check
  // once (filenames are intentionally discarded) whenever any TS file is staged.
  "*.{ts,tsx}": () => "tsc --noEmit",
}

export default config
