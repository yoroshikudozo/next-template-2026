import { Suspense } from "react"
import { Filters } from "./filters"
import { search } from "./search-schema"

/**
 * サーバーコンポーネント。`searchParams`（Next.js 16 では Promise）を await し、
 * 同じ schema で型付き値に decode する。実データ取得はこの値で行う。
 */
export default async function SearchPage(props: PageProps<"/search">) {
  const values = search.parse(await props.searchParams)

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
