/**
 * decode 用の最小プリミティブ群。
 *
 * URL のクエリは multimap（同名キーが複数あり得る）。qs などでパースした
 * 生の値は `string | string[] | undefined` になる。これらを field ごとに
 * 合成して decode を組み、最終検証は transformStandardSchema に渡す。
 *
 * すべて pure function なので valibot 抜きで単体テストできる。
 */

/** 複数値でも最初の 1 件だけ取る（単一値が欲しい場面）。 */
export function firstOf(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v
}

/** 常に配列へ正規化する。未指定は空配列。 */
export function ensureArray(v: string | string[] | undefined): string[] {
  if (v === undefined) return []
  return Array.isArray(v) ? v : [v]
}

/**
 * カンマ区切り文字列を配列へ。`"0,1" → ["0","1"]`。
 * 空文字・未指定は空配列（`"".split(",")` の `[""]` を避ける）。
 * 各要素は trim し、空要素は捨てる。
 */
export function splitComma(s: string | undefined): string[] {
  if (s === undefined || s.trim() === "") return []
  return s
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part !== "")
}

/** number へ変換。空・非数値・NaN なら fallback。 */
export function toNumber(s: string | undefined, fallback: number): number {
  if (s === undefined || s.trim() === "") return fallback
  const n = Number(s)
  return Number.isFinite(n) ? n : fallback
}

/** 許可リストに含まれるときだけ返し string を union 型 T に絞り込む。 */
export function oneOf<const T extends string>(
  s: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(s as T) ? (s as T) : fallback
}
