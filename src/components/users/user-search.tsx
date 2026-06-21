import { Suspense } from "react"
import { UserFilters } from "@/components/users/user-filters"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getUsers } from "@/features/users/api/get-users"
import { userSearchSchema } from "@/features/users/search-schema"

/**
 * users 機能のサーバー View。searchParams を decode し、getUsers（MSW モック）で
 * 取得して一覧＋ページネーションを描画する。ページ送りは総数を知るここで Link 化。
 *
 * searchParams の型は Next が生成する PageProps から導出（独自 remap を持たない）。
 */
export async function UserSearch({
  searchParams,
}: {
  searchParams: Awaited<PageProps<"/users">["searchParams"]>
}) {
  const filters = userSearchSchema.parse(searchParams)
  const { users, total, page, perPage } = await getUsers(filters)
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  const pageHref = (p: number) =>
    `/users?${userSearchSchema.serialize({ ...filters, page: p })}`

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-8">
      <h1 className="text-xl font-semibold">Users</h1>

      <Suspense fallback={<div className="text-sm">フィルタを読み込み中…</div>}>
        <UserFilters />
      </Suspense>

      <p className="text-sm text-muted-foreground">
        {total} 件中 {page}/{totalPages} ページ
      </p>

      <ul className="divide-y rounded border">
        {users.map((u) => (
          <li
            key={u.id}
            className="flex items-center justify-between gap-4 p-3 text-sm"
          >
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-muted-foreground">{u.email}</div>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="rounded bg-muted px-2 py-0.5">{u.role}</span>
              <span className="rounded bg-muted px-2 py-0.5">{u.status}</span>
            </div>
          </li>
        ))}
        {users.length === 0 && (
          <li className="p-3 text-sm text-muted-foreground">該当なし</li>
        )}
      </ul>

      <Pagination>
        <PaginationContent className="w-full justify-between">
          <PaginationItem>
            <PaginationPrevious
              text="前"
              href={page > 1 ? pageHref(page - 1) : undefined}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              text="次"
              href={page < totalPages ? pageHref(page + 1) : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  )
}
