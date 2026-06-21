import type { UserRole, UserStatus } from "./consts"

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
