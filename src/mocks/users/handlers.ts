import { http, HttpResponse } from "msw"
import type { UsersResponse } from "@/features/users/types"
import { users } from "./data"

const PER_PAGE = 5

/**
 * users 機能の MSW ハンドラ。`?q=&role=&status=&sort=&page=` で絞り込み・並び替え・
 * ページングする。role/status はカンマ区切りの複数値で OR 絞り込み（空なら絞り込みなし）。
 * src/mocks/handlers.ts がこれを集約する。
 */
export const userHandlers = [
  http.get("*/api/users", ({ request }) => {
    const url = new URL(request.url)
    const q = (url.searchParams.get("q") ?? "").trim().toLowerCase()
    // `?role=admin,guest` を集合へ。空なら絞り込みなし。
    const roles = (url.searchParams.get("role") ?? "")
      .split(",")
      .filter(Boolean)
    const statuses = (url.searchParams.get("status") ?? "")
      .split(",")
      .filter(Boolean)
    const sort = url.searchParams.get("sort") ?? "name"

    const filtered = users.filter((u) => {
      if (q && !`${u.name} ${u.email}`.toLowerCase().includes(q)) return false
      if (roles.length && !roles.includes(u.role)) return false
      if (statuses.length && !statuses.includes(u.status)) return false
      return true
    })

    const sorted = [...filtered].sort((a, b) =>
      sort === "-created"
        ? b.createdAt.localeCompare(a.createdAt)
        : a.name.localeCompare(b.name),
    )

    const total = sorted.length
    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
    // 非整数・範囲外を正規化して「実際に提供したページ」を返す。
    const requested = Math.floor(Number(url.searchParams.get("page"))) || 1
    const page = Math.min(Math.max(1, requested), totalPages)

    const start = (page - 1) * PER_PAGE
    const body: UsersResponse = {
      users: sorted.slice(start, start + PER_PAGE),
      total,
      page,
      perPage: PER_PAGE,
    }
    return HttpResponse.json(body)
  }),
]
