import { createSearchParams } from "@/lib/search-params/factory"
import { field } from "@/lib/search-params/field"

export const SORT_OPTIONS = ["new", "popular"] as const

/**
 * search 機能のクエリ定義。サーバー（SearchView）とクライアント（Filters）が
 * この 1 つを共有する。`?q=shoes&type=0,1&sort=popular&page=2`
 */
export const search = createSearchParams({
  q: field.string(), // 自由テキスト（単一）
  type: field.commaNumbers(), // 閉じた集合 → カンマ
  sort: field.enums(SORT_OPTIONS, "new"),
  page: field.number(1),
})
