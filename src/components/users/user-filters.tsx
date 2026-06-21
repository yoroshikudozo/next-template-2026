"use client"

import { useEffect, useState } from "react"
import { useSearchParamsState } from "@/lib/search-params/use-search-params-state"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { USER_ROLES, USER_STATUSES } from "@/features/users/consts"
import type { UserRole, UserStatus } from "@/features/users/types"
import { SORT_OPTIONS, userSearchSchema } from "@/features/users/search-schema"

type SortKey = (typeof SORT_OPTIONS)[number]

const SORT_LABEL: Record<SortKey, string> = {
  name: "名前順",
  "-created": "新しい順",
}

/** 複数選択トリガーの表示。未選択はプレースホルダ、選択ありは値をカンマ連結。 */
function multiLabel(placeholder: string) {
  return (selected: readonly string[]) =>
    selected.length === 0 ? placeholder : selected.join(", ")
}

/**
 * クライアント側のフィルタ UI（q / role / status / sort）。URL と双方向に同期し、
 * 条件を変えたら 1 ページ目へ戻す。フィルタ更新は履歴を汚さないよう replace。
 * role/status は複数選択（searchParams のカンマ配列に対応）。
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
      <Input
        className="w-48"
        placeholder="名前・メールで検索"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <Select
        multiple
        value={filters.role}
        onValueChange={(role: UserRole[]) => setFilters({ role, page: 1 })}
      >
        <SelectTrigger className="min-w-32" aria-label="権限で絞り込み">
          <SelectValue>{multiLabel("権限：すべて")}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {USER_ROLES.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        multiple
        value={filters.status}
        onValueChange={(status: UserStatus[]) =>
          setFilters({ status, page: 1 })
        }
      >
        <SelectTrigger className="min-w-32" aria-label="状態で絞り込み">
          <SelectValue>{multiLabel("状態：すべて")}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {USER_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sort}
        onValueChange={(sort: SortKey | null) => sort && setFilters({ sort })}
      >
        <SelectTrigger aria-label="並び替え">
          <SelectValue>{(s: SortKey) => SORT_LABEL[s]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((s) => (
            <SelectItem key={s} value={s}>
              {SORT_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
