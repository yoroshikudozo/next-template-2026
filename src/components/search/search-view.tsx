import { Suspense } from "react"
import { Filters } from "@/components/search/filters"
import { search } from "@/features/search/schema"
import type { RawSearchParams } from "@/lib/search-params/factory"

/**
 * search 機能のサーバー View。ルート（page.tsx）から await 済みの searchParams を
 * 受け取り、同じ schema で型付き値に decode して描画する。実データ取得もここで。
 */
export function SearchView({
  searchParams,
}: {
  searchParams: RawSearchParams
}) {
  const values = search.parse(searchParams)

  return (
    <main className="mx-auto max-w-xl space-y-4 p-8">
      <h1 className="text-xl font-semibold">Search</h1>

      <Suspense fallback={<div className="text-sm">フィルタを読み込み中…</div>}>
        <Filters />
      </Suspense>

      <pre className="rounded bg-muted p-3 text-sm">
        {JSON.stringify(values, null, 2)}
      </pre>
    </main>
  )
}
