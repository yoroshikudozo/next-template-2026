import type { StandardSchemaV1 } from "@standard-schema/spec"
import * as v from "valibot"
import { ensureArray, firstOf, oneOf, splitComma, toNumber } from "./decode"
import { joinComma, omitEmpty, repeat, toStr } from "./encode"

/** クエリの生値（multimap）。 */
type Raw = string | string[] | undefined

/**
 * 1 つの検索パラメータの定義。
 *
 * - `schema`: 生値 → 型付き値の decode。decode 最小関数を valibot の transform
 *   として合成し、transformStandardSchema で実行する（= Standard Schema）。
 * - `encode`: 型付き値 → wire。encode 最小関数を合成。`undefined` で省略。
 *
 * decode と encode は非対称・lossy なので、自動逆算せず明示的にペアで持つ。
 */
export interface Field<T> {
  schema: StandardSchemaV1<unknown, T>
  encode: (value: T) => string | string[] | undefined
}

/** 単一文字列。未指定は fallback。 */
function string(fallback = ""): Field<string> {
  return {
    schema: v.pipe(
      v.unknown(),
      v.transform((raw) => firstOf(raw as Raw) ?? fallback),
      v.string(),
    ) as StandardSchemaV1<unknown, string>,
    encode: (value) => omitEmpty(value),
  }
}

/** 単一数値。非数値・未指定は fallback。 */
function number(fallback = 0): Field<number> {
  return {
    schema: v.pipe(
      v.unknown(),
      v.transform((raw) => toNumber(firstOf(raw as Raw), fallback)),
      v.number(),
    ) as StandardSchemaV1<unknown, number>,
    encode: (value) => toStr(value),
  }
}

/** 閉じた集合（enum）。許可リスト外・未指定は fallback。 */
function enums<const T extends string>(
  allowed: readonly T[],
  fallback: T,
): Field<T> {
  return {
    schema: v.pipe(
      v.unknown(),
      v.transform((raw) => oneOf(firstOf(raw as Raw), allowed, fallback)),
      v.picklist(allowed),
    ) as StandardSchemaV1<unknown, T>,
    encode: (value) => omitEmpty(value),
  }
}

/** カンマ区切りの数値配列（閉じた集合向け）。`?type=0,1`。 */
function commaNumbers(): Field<number[]> {
  return {
    schema: v.pipe(
      v.unknown(),
      v.transform((raw) =>
        splitComma(firstOf(raw as Raw))
          .map((s) => toNumber(s, NaN))
          .filter((n) => Number.isFinite(n)),
      ),
      v.array(v.number()),
    ) as StandardSchemaV1<unknown, number[]>,
    encode: (value) => joinComma(value),
  }
}

/** カンマ区切りの文字列配列（閉じた集合向け）。`?size=s,m,l`。 */
function commaStrings(): Field<string[]> {
  return {
    schema: v.pipe(
      v.unknown(),
      v.transform((raw) => splitComma(firstOf(raw as Raw))),
      v.array(v.string()),
    ) as StandardSchemaV1<unknown, string[]>,
    encode: (value) => joinComma(value),
  }
}

/** repeat 形式の文字列配列（カンマを含みうる自由テキスト向け）。`?q=a&q=b`。 */
function repeatStrings(): Field<string[]> {
  return {
    schema: v.pipe(
      v.unknown(),
      v.transform((raw) => ensureArray(raw as Raw)),
      v.array(v.string()),
    ) as StandardSchemaV1<unknown, string[]>,
    encode: (value) => repeat(value),
  }
}

/** field コンストラクタ集。`f.string()` のように使う。 */
export const field = {
  string,
  number,
  enums,
  commaNumbers,
  commaStrings,
  repeatStrings,
}
