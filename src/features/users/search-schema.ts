import { createSearchParams } from "@/lib/search-params/factory"
import { field } from "@/lib/search-params/field"
import { USER_ROLES, USER_STATUSES } from "./consts"

export const SORT_OPTIONS = ["name", "-created"] as const

/**
 * user 検索のクエリ定義。サーバー（UserSearch）・クライアント（UserFilters）・
 * API 呼び出し（getUsers の serialize）がこの 1 つを共有する。
 * role/status は複数選択（カンマ区切り、未設定なら絞り込みなし＝空配列）。
 * `?q=alice&role=admin,guest&status=active&sort=-created&page=2`
 */
export const userSearchSchema = createSearchParams({
  q: field.string(),
  role: field.commaEnums(USER_ROLES), // UserRole[]
  status: field.commaEnums(USER_STATUSES), // UserStatus[]
  sort: field.enums(SORT_OPTIONS, "name"),
  page: field.number(1),
})

/** parse 済みの型付きクエリ値。 */
export type UserSearchValues = ReturnType<typeof userSearchSchema.parse>
