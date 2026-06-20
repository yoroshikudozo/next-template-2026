import qs from "qs"
import type { Field } from "./field"
import { transformStandardSchema } from "./transform-standard-schema"

/** Next.js のサーバーページが受け取る searchParams の生の形（multimap）。 */
export type RawSearchParams = { [key: string]: string | string[] | undefined }

/** parse が受け付ける入力。サーバーの object / URLSearchParams / クエリ文字列。 */
export type SearchParamsInput = RawSearchParams | URLSearchParams | string

// Field の encode が引数で contravariant なため、制約には any を使う
// （個々のフィールド型は Values の infer で正しく取り出す）。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Schema = Record<string, Field<any>>

type Values<S extends Schema> = {
  [K in keyof S]: S[K] extends Field<infer T> ? T : never
}

/**
 * 入力を `{ [key]: string | string[] | undefined }` に正規化する。
 *
 * URLSearchParams / 文字列は qs.parse を通して、repeat キー（`a=1&a=2`）を
 * 配列に畳む。これでサーバー（既に object）とクライアント（URLSearchParams）が
 * 同じ shape になり、同じ field decoder を共有できる。
 */
function normalizeInput(input: SearchParamsInput): RawSearchParams {
  if (typeof input === "string") {
    return qs.parse(input, { ignoreQueryPrefix: true }) as RawSearchParams
  }
  if (input instanceof URLSearchParams) {
    return qs.parse(input.toString()) as RawSearchParams
  }
  return input
}

/**
 * schema 1 つから、サーバー/クライアント共通の reader（parse）と
 * クエリ文字列ビルダー（serialize）を生やす factory。
 */
export function createSearchParams<S extends Schema>(schema: S) {
  /** 生の searchParams を型付き値へ。component はこれだけ呼べばよい。 */
  function parse(input: SearchParamsInput): Values<S> {
    const raw = normalizeInput(input)
    const out = {} as Record<string, unknown>
    for (const key of Object.keys(schema)) {
      out[key] = transformStandardSchema(schema[key].schema, raw[key])
    }
    return out as Values<S>
  }

  /**
   * 型付き値（部分可）からクエリ文字列を組み立てる。配列値は repeat、
   * カンマ field は既に文字列化済み。空値は省略。`?` は付けない。
   */
  function serialize(values: Partial<Values<S>>): string {
    const wire: Record<string, string | string[]> = {}
    for (const key of Object.keys(schema)) {
      if (!(key in values)) continue
      const encoded = schema[key].encode(values[key])
      if (encoded !== undefined) wire[key] = encoded
    }
    return qs.stringify(wire, { arrayFormat: "repeat" })
  }

  return { parse, serialize }
}
