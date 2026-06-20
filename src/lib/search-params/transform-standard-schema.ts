import type { StandardSchemaV1 } from "@standard-schema/spec"

/**
 * Standard Schema の検証が失敗したときに投げるエラー。
 * `~standard` の issues をそのまま保持する。
 */
export class SearchParamsError extends Error {
  readonly issues: readonly StandardSchemaV1.Issue[]

  constructor(issues: readonly StandardSchemaV1.Issue[]) {
    super(issues[0]?.message ?? "Invalid search params")
    this.name = "SearchParamsError"
    this.issues = issues
  }
}

/**
 * Standard Schema（valibot / zod / arktype …）を実行し、型付き値を返す薄い runner。
 * 検証ライブラリ非依存にするための境界。
 *
 * - 同期スキーマ専用（クエリのパースは同期で完結すべき）。async なら投げる。
 * - 検証失敗時は SearchParamsError を投げる。フィールドが fallback を持つ前提なら
 *   通常ここには到達しない。
 */
export function transformStandardSchema<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
): StandardSchemaV1.InferOutput<T> {
  const result = schema["~standard"].validate(input)

  if (result instanceof Promise) {
    throw new TypeError("search-params schema must be synchronous")
  }

  if (result.issues) {
    throw new SearchParamsError(result.issues)
  }

  return result.value
}
