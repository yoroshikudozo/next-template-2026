import { apiGet } from "@/lib/api/client"
import { userSearchSchema, type UserSearchValues } from "../search-schema"
import type { UsersResponse } from "../types"

/**
 * 検索条件でユーザー一覧を取得する。クエリ文字列は search schema の serialize を
 * 再利用するので、URL と API のパラメータ表現が 1 つに揃う。
 */
export function getUsers(values: UserSearchValues): Promise<UsersResponse> {
  const query = userSearchSchema.serialize(values)
  return apiGet<UsersResponse>(`/users${query ? `?${query}` : ""}`)
}
