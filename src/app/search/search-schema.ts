import { createSearchParams, field as f } from "@/lib/search-params"

export const SORT_OPTIONS = ["new", "popular"] as const

/**
 * /search のクエリ定義。サーバー（page）とクライアント（filters）が
 * この 1 つを共有する。`?q=shoes&type=0,1&sort=popular&page=2`
 */
export const search = createSearchParams({
  q: f.string(), // 自由テキスト（単一）
  type: f.commaNumbers(), // 閉じた集合 → カンマ
  sort: f.enums(SORT_OPTIONS, "new"),
  page: f.number(1),
})
