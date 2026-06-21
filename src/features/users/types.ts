// role/status の許可値は単一ソース。型・スキーマ・UI 選択肢がすべてここから導出される。
export const USER_ROLES = ["admin", "member", "guest"] as const
export const USER_STATUSES = ["active", "invited", "suspended"] as const

export type UserRole = (typeof USER_ROLES)[number]
export type UserStatus = (typeof USER_STATUSES)[number]

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  /** ISO 8601 */
  createdAt: string
}

/** GET /api/users のレスポンス。 */
export interface UsersResponse {
  users: User[]
  total: number
  page: number
  perPage: number
}
