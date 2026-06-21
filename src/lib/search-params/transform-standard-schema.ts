import type { StandardSchemaV1 } from "@standard-schema/spec"

/**
 * Standard Schema の検証が失敗したときに投げるエラー。
 * `~standard` の issues をそのまま保持する。
 */
export class SearchParamsError extends Error {
  readonly issues: readonly StandardSchemaV1.Issue[]

  constructor(
    issues: readonly StandardSchemaV1.Issue[],
    options?: { cause?: unknown },
  ) {
    super(issues[0]?.message ?? "Invalid search params", options)
    this.name = "SearchParamsError"
    this.issues = issues
  }
}

/**
 * Standard Schema（valibot / zod / arktype …）を実行し、型付き値を返す薄い runner。
 * 検証ライブラリ非依存にするための境界。
 *
 * - 同期スキーマ専用（クエリのパースは同期で完結すべき）。async なら投げる。
 * - 検証失敗・スキーマ内 transform の同期 throw はいずれも SearchParamsError に
 *   正規化する（生の TypeError 等を境界の外に漏らさない）。組み込み field は
 *   常に fallback するので、通常この throw 経路には到達しない。
 */
export function transformStandardSchema<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
): StandardSchemaV1.InferOutput<T> {
  let result: ReturnType<T["~standard"]["validate"]>
  try {
    result = schema["~standard"].validate(input) as typeof result
  } catch (cause) {
    // transform 内のユーザーコードが同期 throw した場合も型付きエラーに揃える。
    throw new SearchParamsError(
      [{ message: cause instanceof Error ? cause.message : "schema threw" }],
      { cause },
    )
  }

  if (result instanceof Promise) {
    throw new TypeError("search-params schema must be synchronous")
  }

  if (result.issues) {
    throw new SearchParamsError(result.issues)
  }

  return result.value
}
