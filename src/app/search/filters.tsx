"use client"

import { useSearchParamsState } from "@/lib/search-params/use-search-params-state"
import { search, SORT_OPTIONS } from "./search-schema"

/**
 * クライアント側のフィルタ UI。URL と双方向に同期する。
 * useSearchParams を使うので、親で <Suspense> に包む（page.tsx 参照）。
 */
export function Filters() {
  const [values, setValues] = useSearchParamsState(search)

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <input
        className="rounded border px-2 py-1"
        placeholder="検索語"
        value={values.q}
        // 検索語を変えたら 1 ページ目へ戻す
        onChange={(e) => setValues({ q: e.target.value, page: 1 })}
      />

      <select
        className="rounded border px-2 py-1"
        value={values.sort}
        onChange={(e) =>
          setValues({ sort: e.target.value as (typeof SORT_OPTIONS)[number] })
        }
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <button
        className="rounded border px-2 py-1"
        onClick={() => setValues({ page: values.page + 1 })}
      >
        次のページ（現在 {values.page}）
      </button>
    </div>
  )
}
