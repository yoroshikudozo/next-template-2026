/**
 * encode 用の最小プリミティブ群（値 → wire）。
 *
 * 各 field の encode はこれらを合成して `string | string[] | undefined` を返す。
 * `undefined` は「クエリから省略」を意味する。最終的な直列化（qs.stringify）は
 * factory 側がまとめて行う。すべて pure function で単体テストできる。
 */

/** 値を文字列へ。 */
export function toStr(v: string | number | boolean): string {
  return String(v)
}

/** 配列をカンマ区切りへ。`[0,1] → "0,1"`。空配列は undefined（省略）。 */
export function joinComma(
  arr: readonly (string | number)[],
): string | undefined {
  if (arr.length === 0) return undefined
  return arr.map(String).join(",")
}

/** repeat 用に配列を返す。空文字は捨て、空配列は undefined（省略）。 */
export function repeat(arr: readonly string[]): string[] | undefined {
  const filtered = arr.filter((s) => s !== "")
  return filtered.length === 0 ? undefined : filtered
}

/** 空文字を undefined に倒す（単一値の省略判定）。 */
export function omitEmpty(v: string | undefined): string | undefined {
  return v === undefined || v === "" ? undefined : v
}
