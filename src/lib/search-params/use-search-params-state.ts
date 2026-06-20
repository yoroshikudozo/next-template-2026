"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import type { SearchParamsInput } from "./factory"

interface SearchParamsApi<V extends Record<string, unknown>> {
  parse: (input: SearchParamsInput) => V
  serialize: (values: Partial<V>) => string
}

/**
 * createSearchParams の戻り値を渡すと、現在の型付き値と URL 更新 setter を返す
 * クライアントフック。サーバーの parse と同じ schema・同じ型を共有する。
 *
 * - `useSearchParams` を使うので、呼び出すコンポーネントは `<Suspense>` で包むこと
 *   （prerender 時に最寄りの境界まで CSR に落ちるのを局所化するため）。
 * - setter は現在値とマージして push するので、一部の param だけ更新できる。
 */
export function useSearchParamsState<V extends Record<string, unknown>>(
  sp: SearchParamsApi<V>,
): readonly [V, (patch: Partial<V>) => void] {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  // 文字列経由で渡し、ReadonlyURLSearchParams の instanceof 差異を回避する。
  // URL（query）が変わらない限り values の identity を保ち、再 parse も避ける。
  const query = params.toString()
  const values = useMemo(() => sp.parse(query), [sp, query])

  const setValues = useCallback(
    (patch: Partial<V>) => {
      const next = sp.serialize({ ...values, ...patch })
      router.push(next ? `${pathname}?${next}` : pathname)
    },
    [router, pathname, sp, values],
  )

  return [values, setValues] as const
}
