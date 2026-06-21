"use client"

import { useEffect, useState } from "react"
import { useSearchParamsState } from "@/lib/search-params/use-search-params-state"
import { USER_ROLES, USER_STATUSES } from "@/features/users/consts"
import { SORT_OPTIONS, userSearchSchema } from "@/features/users/search-schema"

const SORT_LABEL: Record<(typeof SORT_OPTIONS)[number], string> = {
  name: "名前順",
  "-created": "新しい順",
}

/**
 * クライアント側のフィルタ UI（q / role / status / sort）。URL と双方向に同期し、
 * 条件を変えたら 1 ページ目へ戻す。フィルタ更新は履歴を汚さないよう replace。
 * useSearchParams を使うので親で <Suspense>。
 */
export function UserFilters() {
  const [filters, setFilters] = useSearchParamsState(userSearchSchema, {
    history: "replace",
  })

  // テキスト検索はローカル state で即応答し、URL 同期は debounce する
  // （毎キーのナビゲーション/フェッチと履歴汚染・入力ラグを避ける）。
  const [q, setQ] = useState(filters.q)
  // URL が外部要因（戻る/共有 URL）で変わったらローカル入力を追従させる。
  // effect ではなくレンダー時に調整する React 推奨パターン。
  const [syncedUrlQ, setSyncedUrlQ] = useState(filters.q)
  if (filters.q !== syncedUrlQ) {
    setSyncedUrlQ(filters.q)
    setQ(filters.q)
  }
  useEffect(() => {
    if (q === filters.q) return
    const t = setTimeout(() => setFilters({ q, page: 1 }), 300)
    return () => clearTimeout(t)
  }, [q, filters.q, setFilters])

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <input
        className="rounded border px-2 py-1"
        placeholder="名前・メールで検索"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <select
        className="rounded border px-2 py-1"
        value={filters.role ?? ""}
        onChange={(e) =>
          setFilters({
            role: (e.target.value || undefined) as
              | (typeof USER_ROLES)[number]
              | undefined,
            page: 1,
          })
        }
      >
        <option value="">権限：すべて</option>
        {USER_ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <select
        className="rounded border px-2 py-1"
        value={filters.status ?? ""}
        onChange={(e) =>
          setFilters({
            status: (e.target.value || undefined) as
              | (typeof USER_STATUSES)[number]
              | undefined,
            page: 1,
          })
        }
      >
        <option value="">状態：すべて</option>
        {USER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        className="rounded border px-2 py-1"
        value={filters.sort}
        onChange={(e) =>
          setFilters({ sort: e.target.value as (typeof SORT_OPTIONS)[number] })
        }
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {SORT_LABEL[s]}
          </option>
        ))}
      </select>
    </div>
  )
}
